'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useConversation } from '@elevenlabs/react';
import { useTimerStore } from '@/lib/stores/timerStore';
import { useTasks } from '@/contexts/TaskContext';
import { useFocusSession } from '@/contexts/FocusSessionContext';
import { useVoiceCoachData } from '@/hooks/useVoiceCoachData';
import { buildContextString } from '@/lib/ai/voiceCoachPrompts';
import { createTask, updateTask, deleteTask, searchTasks, getTaskById } from '@/lib/tasks';
import { createSubtask, updateSubtask, deleteSubtask } from '@/lib/subtasks';
import { SubtaskStatusEnum } from '@/types/subtasks';
import { rateSession, addSessionNote } from '@/lib/voiceCoachStats';
import { useAuth } from '@/components/AuthProvider';

export type VoiceCoachStatus =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'speaking'
  | 'error';

export interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceCoachContextType {
  isOpen: boolean;
  status: VoiceCoachStatus;
  messages: VoiceMessage[];
  error: string | null;
  isSupported: boolean;
  isMuted: boolean;

  // Actions
  openCoach: () => void;
  closeCoach: () => void;
  toggleCoach: () => void;
  toggleMute: () => void;
  clearMessages: () => void;
}

const VoiceCoachContext = createContext<VoiceCoachContextType | undefined>(undefined);

// Parse action markers from agent responses
function parseActions(text: string): { cleanText: string; actions: Array<{ name: string; params: string }> } {
  const actionRegex = /\[ACTION:(\w+)(?::([^\]]+))?\]/g;
  const actions: Array<{ name: string; params: string }> = [];
  let match;

  while ((match = actionRegex.exec(text)) !== null) {
    actions.push({
      name: match[1],
      params: match[2] || '',
    });
  }

  const cleanText = text.replace(actionRegex, '').trim();
  return { cleanText, actions };
}

export function VoiceCoachProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<VoiceCoachStatus>('idle');
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Get user for task creation
  const { user } = useAuth();

  // Get context data for AI
  const voiceCoachData = useVoiceCoachData();
  const { refreshTasks } = useTasks();
  const { startSession, completeSession: completeFocusSession } = useFocusSession();
  const timerStore = useTimerStore();

  // Track if we've sent initial context
  const hasStartedRef = useRef(false);
  const lastContextRef = useRef<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversationRef = useRef<any>(null);

  // Helper to force context update after task actions
  // Uses refs to avoid circular dependencies with useConversation
  const forceContextUpdate = useCallback(() => {
    setTimeout(() => {
      const contextString = buildContextString(voiceCoachData);
      if (conversationRef.current?.sendContextualUpdate && contextString !== lastContextRef.current) {
        lastContextRef.current = contextString;
        conversationRef.current.sendContextualUpdate(contextString);
        console.log('[VoiceCoach] Context force-updated after action');
      }
    }, 150); // Small delay to let refreshTasks complete
  }, [voiceCoachData]);

  // Helper to find task by ID or title
  const findTask = useCallback((identifier: string) => {
    // Try to find by ID first (full or short)
    const allTasks = voiceCoachData.tasks.allPending;
    let task = allTasks.find(t => t.id === identifier || t.shortId === identifier);

    // If not found, search by title
    if (!task) {
      task = allTasks.find(t =>
        t.title.toLowerCase().includes(identifier.toLowerCase())
      );
    }

    // Also check high priority and today due tasks
    if (!task) {
      task = voiceCoachData.tasks.highPriority.find(t =>
        t.id === identifier || t.shortId === identifier ||
        t.title.toLowerCase().includes(identifier.toLowerCase())
      );
    }

    if (!task) {
      task = voiceCoachData.tasks.todayDue.find(t =>
        t.id === identifier || t.shortId === identifier ||
        t.title.toLowerCase().includes(identifier.toLowerCase())
      );
    }

    return task;
  }, [voiceCoachData.tasks]);

  // Execute tool actions from agent response
  const executeAction = useCallback(async (action: { name: string; params: string }) => {
    try {
      switch (action.name) {
        // ========== TIMER ACTIONS ==========
        case 'start_focus_session': {
          const duration = parseInt(action.params, 10) || 25;
          await startSession({ duration });
          break;
        }
        case 'pause_timer': {
          timerStore.setIsRunning(false);
          break;
        }
        case 'resume_timer': {
          if (timerStore.timeInSeconds > 0) {
            timerStore.setIsRunning(true);
          }
          break;
        }
        case 'complete_session': {
          await completeFocusSession();
          break;
        }

        // ========== TASK CRUD ACTIONS ==========
        case 'complete_task': {
          // params: taskId or title
          const identifier = action.params.trim();
          const task = findTask(identifier);
          if (task) {
            await updateTask(task.id, { status: 'completed' });
            console.log('[VoiceCoach] Task completed:', task.title);
            await refreshTasks();
            forceContextUpdate();
          } else {
            console.warn('[VoiceCoach] Task not found:', identifier);
          }
          break;
        }

        case 'create_task': {
          if (!user) {
            console.warn('[VoiceCoach] Cannot create task: user not authenticated');
            break;
          }
          // params format: "título|prioridad|descripción" (prioridad y descripción opcionales)
          const [title, priorityStr, description] = action.params.split('|');
          if (!title || !title.trim()) {
            console.warn('[VoiceCoach] Cannot create task: title is required');
            break;
          }

          const priority = parseInt(priorityStr, 10) || 2; // default: media

          await createTask({
            user_id: user.id,
            title: title.trim(),
            priority: Math.min(Math.max(priority, 1), 4), // Clamp between 1-4
            status: 'pending',
            description: description?.trim() || null,
            due_date: null,
            tags: [],
            ai_metadata: { created_by: 'voice_coach' }
          });
          console.log('[VoiceCoach] Task created:', title.trim());
          await refreshTasks();
          forceContextUpdate();
          break;
        }

        case 'edit_task': {
          // params format: "taskId|campo|valor"
          const [taskIdOrTitle, field, value] = action.params.split('|');
          const task = findTask(taskIdOrTitle);

          if (!task) {
            console.warn('Task not found for edit:', taskIdOrTitle);
            break;
          }

          const updates: Record<string, unknown> = {};

          switch (field?.toLowerCase()) {
            case 'title':
            case 'titulo':
              updates.title = value?.trim();
              break;
            case 'priority':
            case 'prioridad':
              const priorityNum = parseInt(value, 10);
              if (priorityNum >= 1 && priorityNum <= 4) {
                updates.priority = priorityNum;
              }
              break;
            case 'description':
            case 'descripcion':
              updates.description = value?.trim() || null;
              break;
            case 'due_date':
            case 'fecha':
              // Accept YYYY-MM-DD format or null
              updates.due_date = value?.trim() || null;
              break;
            case 'status':
            case 'estado':
              if (['pending', 'in_progress', 'completed'].includes(value)) {
                updates.status = value;
              }
              break;
            default:
              console.warn('Unknown field to edit:', field);
          }

          if (Object.keys(updates).length > 0) {
            await updateTask(task.id, updates);
            console.log('[VoiceCoach] Task edited:', task.title, updates);
            await refreshTasks();
            forceContextUpdate();
          }
          break;
        }

        case 'delete_task': {
          // params format: "taskId|confirmar" (confirmar is required)
          const [taskIdOrTitle, confirmation] = action.params.split('|');

          if (confirmation?.toLowerCase() !== 'confirmar' && confirmation?.toLowerCase() !== 'confirm') {
            console.warn('Task deletion requires confirmation');
            break;
          }

          const task = findTask(taskIdOrTitle);
          if (task) {
            await deleteTask(task.id);
            console.log('[VoiceCoach] Task deleted:', task.title);
            await refreshTasks();
            forceContextUpdate();
          } else {
            console.warn('[VoiceCoach] Task not found for deletion:', taskIdOrTitle);
          }
          break;
        }

        case 'search_task': {
          // params: search query
          if (!user) break;

          const query = action.params.trim();
          const results = await searchTasks(user.id, query);

          // Log results for debugging - agent should use context for response
          console.log('[VoiceCoach] Search results:', results.slice(0, 5).map(t => t.title));
          break;
        }

        case 'get_task_details': {
          // params: taskId or title
          const identifier = action.params.trim();
          const taskSummary = findTask(identifier);

          if (taskSummary) {
            const fullTask = await getTaskById(taskSummary.id);
            console.log('[VoiceCoach] Task details:', fullTask);
          } else {
            console.warn('[VoiceCoach] Task not found for details:', identifier);
          }
          break;
        }

        // ========== SUBTASK ACTIONS ==========
        case 'create_subtask': {
          if (!user) {
            console.warn('[VoiceCoach] Cannot create subtask: user not authenticated');
            break;
          }

          // params format: "taskId|titulo|prioridad"
          const [taskIdParam, subtaskTitle, subtaskPriorityStr] = action.params.split('|');

          // Use provided taskId or fall back to active task
          let taskId = taskIdParam;
          if (taskIdParam === 'currentTaskId' || !taskIdParam) {
            taskId = timerStore.activeTaskId || voiceCoachData.sessions.activeSessionTaskId || '';
          } else {
            // Try to resolve from short ID or title
            const task = findTask(taskIdParam);
            if (task) taskId = task.id;
          }

          if (!taskId) {
            console.warn('[VoiceCoach] Cannot create subtask: no active task');
            break;
          }

          if (!subtaskTitle?.trim()) {
            console.warn('[VoiceCoach] Cannot create subtask: title is required');
            break;
          }

          await createSubtask({
            user_id: user.id,
            task_id: taskId,
            title: subtaskTitle.trim(),
            priority: parseInt(subtaskPriorityStr, 10) || 2,
          });
          console.log('[VoiceCoach] Subtask created:', subtaskTitle.trim());
          forceContextUpdate();
          break;
        }

        case 'complete_subtask': {
          // params: subtaskId
          const subtaskId = action.params.trim();

          // Find in active task subtasks
          const subtask = voiceCoachData.subtasks.activeTaskSubtasks.find(
            s => s.id === subtaskId || s.title.toLowerCase().includes(subtaskId.toLowerCase())
          );

          if (subtask) {
            await updateSubtask(subtask.id, { status: SubtaskStatusEnum.COMPLETED });
            console.log('[VoiceCoach] Subtask completed:', subtask.title);
            forceContextUpdate();
          } else {
            console.warn('[VoiceCoach] Subtask not found:', subtaskId);
          }
          break;
        }

        case 'delete_subtask': {
          // params: subtaskId
          const subtaskId = action.params.trim();

          const subtask = voiceCoachData.subtasks.activeTaskSubtasks.find(
            s => s.id === subtaskId || s.title.toLowerCase().includes(subtaskId.toLowerCase())
          );

          if (subtask) {
            await deleteSubtask(subtask.id);
            console.log('[VoiceCoach] Subtask deleted:', subtask.title);
            forceContextUpdate();
          } else {
            console.warn('[VoiceCoach] Subtask not found for deletion:', subtaskId);
          }
          break;
        }

        // ========== SESSION ACTIONS ==========
        case 'rate_session': {
          // params: rating (1-5)
          const rating = parseInt(action.params, 10);
          const sessionId = voiceCoachData.sessions.activeSessionId;

          if (!sessionId) {
            // Try to rate the most recent completed session
            const recentSession = voiceCoachData.sessions.todaySessions.find(
              s => s.status === 'completed'
            );
            if (recentSession) {
              await rateSession(recentSession.id, rating);
              console.log('[VoiceCoach] Session rated:', rating);
            } else {
              console.warn('[VoiceCoach] No session to rate');
            }
          } else {
            await rateSession(sessionId, rating);
            console.log('[VoiceCoach] Active session rated:', rating);
          }
          break;
        }

        case 'add_session_note': {
          // params: note text
          const note = action.params.trim();
          const sessionId = voiceCoachData.sessions.activeSessionId;

          if (!sessionId) {
            const recentSession = voiceCoachData.sessions.todaySessions.find(
              s => s.status === 'completed'
            );
            if (recentSession) {
              await addSessionNote(recentSession.id, note);
              console.log('[VoiceCoach] Note added to session');
            } else {
              console.warn('[VoiceCoach] No session to add note to');
            }
          } else {
            await addSessionNote(sessionId, note);
            console.log('[VoiceCoach] Note added to active session');
          }
          break;
        }

        default:
          console.warn('[VoiceCoach] Unknown action:', action.name);
      }
    } catch (err) {
      console.error('[VoiceCoach] Error executing action:', err);
    }
  }, [
    startSession,
    completeFocusSession,
    timerStore,
    refreshTasks,
    voiceCoachData,
    user,
    findTask,
    forceContextUpdate,
  ]);

  // Add message to conversation history
  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    const newMessage: VoiceMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  // ElevenLabs conversation hook
  const conversation = useConversation({
    onConnect: () => {
      console.log('ElevenLabs connected');
      setStatus('listening');
      setError(null);
    },
    onDisconnect: () => {
      console.log('ElevenLabs disconnected');
      setStatus('idle');
      hasStartedRef.current = false;
    },
    onMessage: (message) => {
      console.log('ElevenLabs message:', message);

      // Handle different message types
      if (message.source === 'user') {
        // User transcript
        if (message.message) {
          addMessage('user', message.message);
        }
      } else if (message.source === 'ai') {
        // Agent response
        if (message.message) {
          const { cleanText, actions } = parseActions(message.message);

          if (cleanText) {
            addMessage('assistant', cleanText);
          }

          // Execute any actions found in the response
          for (const action of actions) {
            executeAction(action);
          }
        }
      }
    },
    onModeChange: (mode) => {
      console.log('Mode changed:', mode);
      if (mode.mode === 'speaking') {
        setStatus('speaking');
      } else if (mode.mode === 'listening') {
        setStatus('listening');
      }
    },
    onError: (err) => {
      console.error('ElevenLabs error:', err);
      const errorMessage = typeof err === 'string' ? err : (err as Error)?.message || 'Error en la conexión de voz';
      setError(errorMessage);
      setStatus('error');
    },
  });

  // Keep conversationRef updated after conversation is defined
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  // Check browser support
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      setIsSupported(false);
      return;
    }

    // Check for getUserMedia support
    const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    setIsSupported(hasMediaDevices);
  }, []);

  // Start conversation when coach opens
  const startConversation = useCallback(async () => {
    if (hasStartedRef.current) return;

    try {
      setStatus('connecting');
      setError(null);

      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get agent ID from environment
      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
      if (!agentId) {
        throw new Error('ElevenLabs Agent ID not configured');
      }

      // Start the conversation session
      await conversation.startSession({
        agentId,
        connectionType: 'websocket',
      });

      hasStartedRef.current = true;

      // Send initial context
      const contextString = buildContextString(voiceCoachData);
      lastContextRef.current = contextString;

      // Small delay to ensure connection is ready
      setTimeout(() => {
        if (conversation.sendContextualUpdate) {
          conversation.sendContextualUpdate(contextString);
        }
      }, 500);

    } catch (err) {
      console.error('Error starting conversation:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar la conversación');
      setStatus('error');
      hasStartedRef.current = false;
    }
  }, [conversation, voiceCoachData]);

  // Stop conversation
  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (err) {
      console.error('Error ending conversation:', err);
    }
    hasStartedRef.current = false;
    setStatus('idle');
  }, [conversation]);

  // Update context when data changes
  useEffect(() => {
    if (!hasStartedRef.current || !conversation.sendContextualUpdate) return;

    const contextString = buildContextString(voiceCoachData);
    if (contextString !== lastContextRef.current) {
      lastContextRef.current = contextString;
      console.log('Sending context update to ElevenLabs:', contextString);
      conversation.sendContextualUpdate(contextString);
    }
  }, [voiceCoachData, conversation]);

  // Handle mute toggle
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    // Use the conversation's mute method if available
    if ('setVolume' in conversation && typeof conversation.setVolume === 'function') {
      // Mute by setting input volume to 0
      try {
        conversation.setVolume({ volume: newMuted ? 0 : 1 });
      } catch {
        // Ignore if not supported
      }
    }
  }, [isMuted, conversation]);

  const openCoach = useCallback(() => {
    setIsOpen(true);
    setError(null);
  }, []);

  const closeCoach = useCallback(() => {
    setIsOpen(false);
    stopConversation();
  }, [stopConversation]);

  const toggleCoach = useCallback(() => {
    if (isOpen) {
      closeCoach();
    } else {
      openCoach();
    }
  }, [isOpen, closeCoach, openCoach]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Start conversation when coach opens
  useEffect(() => {
    if (isOpen && !hasStartedRef.current) {
      startConversation();
    }
  }, [isOpen, startConversation]);

  return (
    <VoiceCoachContext.Provider
      value={{
        isOpen,
        status,
        messages,
        error,
        isSupported,
        isMuted,
        openCoach,
        closeCoach,
        toggleCoach,
        toggleMute,
        clearMessages,
      }}
    >
      {children}
    </VoiceCoachContext.Provider>
  );
}

export function useVoiceCoach() {
  const context = useContext(VoiceCoachContext);
  if (context === undefined) {
    throw new Error('useVoiceCoach must be used within a VoiceCoachProvider');
  }
  return context;
}
