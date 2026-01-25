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
import { createComment, getCommentsByTaskId, deleteComment } from '@/lib/comments';
import { createTag, getUserTags, deleteTag, Tag, TAG_COLORS } from '@/lib/tags';

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
  const { startSession, completeSession: completeFocusSession, updateSessionTask } = useFocusSession();

  // State for user tags (cached)
  const [userTags, setUserTags] = useState<Tag[]>([]);

  // Fetch user tags on mount
  useEffect(() => {
    if (user?.id) {
      getUserTags(user.id).then(setUserTags).catch(console.error);
    }
  }, [user?.id]);

  // Helper to refresh user tags
  const refreshUserTags = useCallback(async () => {
    if (user?.id) {
      const tags = await getUserTags(user.id);
      setUserTags(tags);
    }
  }, [user?.id]);
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

          // Support for currentTaskId
          let task;
          if (taskIdOrTitle === 'currentTaskId') {
            const activeId = timerStore.activeTaskId || voiceCoachData.sessions.activeSessionTaskId;
            if (activeId) {
              task = voiceCoachData.tasks.allPending.find(t => t.id === activeId);
            }
          } else {
            task = findTask(taskIdOrTitle);
          }

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
              // Support both string ("high", "medium", "low") and number formats
              const priorityMap: Record<string, number> = { high: 1, alta: 1, medium: 2, media: 2, low: 3, baja: 3 };
              const priorityNum = priorityMap[value?.toLowerCase()] || parseInt(value, 10);
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
              if (['pending', 'in_progress', 'completed'].includes(value?.toLowerCase())) {
                updates.status = value.toLowerCase();
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

        case 'change_session_task': {
          // params: taskId or title
          const identifier = action.params.trim();
          const task = findTask(identifier);

          if (task) {
            await updateSessionTask(task.id);
            console.log('[VoiceCoach] Session task changed to:', task.title);
            forceContextUpdate();
          } else {
            console.warn('[VoiceCoach] Task not found for session change:', identifier);
          }
          break;
        }

        // ========== TASK STATUS ACTIONS ==========
        case 'set_task_status': {
          // params format: "taskId|status"
          const [taskIdOrTitle, newStatus] = action.params.split('|');

          // Support for currentTaskId
          let task;
          if (taskIdOrTitle === 'currentTaskId') {
            const activeId = timerStore.activeTaskId || voiceCoachData.sessions.activeSessionTaskId;
            if (activeId) {
              task = voiceCoachData.tasks.allPending.find(t => t.id === activeId);
            }
          } else {
            task = findTask(taskIdOrTitle);
          }

          if (!task) {
            console.warn('[VoiceCoach] Task not found for status change:', taskIdOrTitle);
            break;
          }

          const validStatuses = ['pending', 'in_progress', 'completed'];
          const statusToSet = newStatus?.toLowerCase().trim();

          if (!validStatuses.includes(statusToSet)) {
            console.warn('[VoiceCoach] Invalid status:', newStatus);
            break;
          }

          await updateTask(task.id, { status: statusToSet as 'pending' | 'in_progress' | 'completed' });
          console.log('[VoiceCoach] Task status changed:', task.title, '->', statusToSet);
          await refreshTasks();
          forceContextUpdate();
          break;
        }

        // ========== TAG ACTIONS ==========
        case 'add_tag_to_task': {
          // params format: "taskId|tagName"
          const [taskIdOrTitle, tagName] = action.params.split('|');

          // Support for currentTaskId
          let task;
          if (taskIdOrTitle === 'currentTaskId') {
            const activeId = timerStore.activeTaskId || voiceCoachData.sessions.activeSessionTaskId;
            if (activeId) {
              task = voiceCoachData.tasks.allPending.find(t => t.id === activeId);
            }
          } else {
            task = findTask(taskIdOrTitle);
          }

          if (!task) {
            console.warn('[VoiceCoach] Task not found for adding tag:', taskIdOrTitle);
            break;
          }

          const tagToAdd = tagName?.trim().toLowerCase();
          if (!tagToAdd) {
            console.warn('[VoiceCoach] Tag name is required');
            break;
          }

          // Get current task to get existing tags
          const fullTask = await getTaskById(task.id);
          const currentTags = fullTask?.tags || [];

          if (!currentTags.includes(tagToAdd)) {
            await updateTask(task.id, {
              tags: [...currentTags, tagToAdd],
              priority: fullTask.priority,
              status: fullTask.status,
            });
            console.log('[VoiceCoach] Tag added to task:', tagToAdd, '->', task.title);
            await refreshTasks();
            forceContextUpdate();
          } else {
            console.log('[VoiceCoach] Tag already exists on task:', tagToAdd);
          }
          break;
        }

        case 'remove_tag_from_task': {
          // params format: "taskId|tagName"
          const [taskIdOrTitle, tagName] = action.params.split('|');

          // Support for currentTaskId
          let task;
          if (taskIdOrTitle === 'currentTaskId') {
            const activeId = timerStore.activeTaskId || voiceCoachData.sessions.activeSessionTaskId;
            if (activeId) {
              task = voiceCoachData.tasks.allPending.find(t => t.id === activeId);
            }
          } else {
            task = findTask(taskIdOrTitle);
          }

          if (!task) {
            console.warn('[VoiceCoach] Task not found for removing tag:', taskIdOrTitle);
            break;
          }

          const tagToRemove = tagName?.trim().toLowerCase();
          if (!tagToRemove) {
            console.warn('[VoiceCoach] Tag name is required');
            break;
          }

          // Get current task to get existing tags
          const fullTask = await getTaskById(task.id);
          const currentTags = fullTask?.tags || [];

          const updatedTags = currentTags.filter((t: string) => t.toLowerCase() !== tagToRemove);
          if (updatedTags.length < currentTags.length) {
            await updateTask(task.id, {
              tags: updatedTags,
              priority: fullTask.priority,
              status: fullTask.status,
            });
            console.log('[VoiceCoach] Tag removed from task:', tagToRemove, '<-', task.title);
            await refreshTasks();
            forceContextUpdate();
          } else {
            console.log('[VoiceCoach] Tag not found on task:', tagToRemove);
          }
          break;
        }

        case 'create_tag': {
          // params format: "tagName|color"
          if (!user) {
            console.warn('[VoiceCoach] Cannot create tag: user not authenticated');
            break;
          }

          const [tagName, colorName] = action.params.split('|');
          const name = tagName?.trim();

          if (!name) {
            console.warn('[VoiceCoach] Tag name is required');
            break;
          }

          // Validate color or default to blue
          const validColors: string[] = TAG_COLORS.map(c => c.name);
          const color = validColors.includes(colorName?.toLowerCase()) ? colorName.toLowerCase() : 'blue';

          await createTag({ user_id: user.id, name, color });
          console.log('[VoiceCoach] Tag created:', name, 'with color:', color);
          await refreshUserTags();
          break;
        }

        case 'list_tags': {
          // No params - returns user tags
          console.log('[VoiceCoach] User tags:', userTags.map(t => `${t.name} (${t.color})`).join(', '));
          break;
        }

        case 'delete_tag': {
          // params format: "tagName|confirmar"
          const [tagName, confirmation] = action.params.split('|');

          if (confirmation?.toLowerCase() !== 'confirmar' && confirmation?.toLowerCase() !== 'confirm') {
            console.warn('[VoiceCoach] Tag deletion requires confirmation');
            break;
          }

          const tagToDelete = userTags.find(
            t => t.name.toLowerCase() === tagName?.toLowerCase().trim()
          );

          if (tagToDelete) {
            await deleteTag(tagToDelete.id);
            console.log('[VoiceCoach] Tag deleted:', tagToDelete.name);
            await refreshUserTags();
          } else {
            console.warn('[VoiceCoach] Tag not found:', tagName);
          }
          break;
        }

        // ========== COMMENT ACTIONS ==========
        case 'add_comment': {
          // params format: "taskId|comment text"
          if (!user) {
            console.warn('[VoiceCoach] Cannot add comment: user not authenticated');
            break;
          }

          const [taskIdOrTitle, ...commentParts] = action.params.split('|');
          const commentText = commentParts.join('|').trim();

          // Use provided taskId or fall back to active task
          let taskId = taskIdOrTitle;
          if (taskIdOrTitle === 'currentTaskId' || !taskIdOrTitle) {
            taskId = timerStore.activeTaskId || voiceCoachData.sessions.activeSessionTaskId || '';
          } else {
            const task = findTask(taskIdOrTitle);
            if (task) taskId = task.id;
          }

          if (!taskId) {
            console.warn('[VoiceCoach] Cannot add comment: no task specified or active');
            break;
          }

          if (!commentText) {
            console.warn('[VoiceCoach] Comment text is required');
            break;
          }

          await createComment({ user_id: user.id, task_id: taskId, content: commentText });
          console.log('[VoiceCoach] Comment added to task');
          break;
        }

        case 'list_comments': {
          // params: taskId or title (optional, defaults to active task)
          const identifier = action.params.trim();

          let taskId = identifier;
          if (identifier === 'currentTaskId' || !identifier) {
            taskId = timerStore.activeTaskId || voiceCoachData.sessions.activeSessionTaskId || '';
          } else {
            const task = findTask(identifier);
            if (task) taskId = task.id;
          }

          if (!taskId) {
            console.warn('[VoiceCoach] Cannot list comments: no task specified or active');
            break;
          }

          const comments = await getCommentsByTaskId(taskId);
          console.log('[VoiceCoach] Task comments:', comments.map(c => c.content).join('; '));
          break;
        }

        case 'delete_comment': {
          // params format: "commentId|confirmar"
          const [commentId, confirmation] = action.params.split('|');

          if (confirmation?.toLowerCase() !== 'confirmar' && confirmation?.toLowerCase() !== 'confirm') {
            console.warn('[VoiceCoach] Comment deletion requires confirmation');
            break;
          }

          if (!commentId?.trim()) {
            console.warn('[VoiceCoach] Comment ID is required');
            break;
          }

          await deleteComment(commentId.trim());
          console.log('[VoiceCoach] Comment deleted');
          break;
        }

        // ========== SUBTASK EDIT ACTION ==========
        case 'edit_subtask': {
          // params format: "subtaskId|campo|valor"
          const [subtaskIdOrTitle, field, value] = action.params.split('|');

          const subtask = voiceCoachData.subtasks.activeTaskSubtasks.find(
            s => s.id === subtaskIdOrTitle || s.title.toLowerCase().includes(subtaskIdOrTitle?.toLowerCase() || '')
          );

          if (!subtask) {
            console.warn('[VoiceCoach] Subtask not found:', subtaskIdOrTitle);
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
            case 'status':
            case 'estado':
              if (['pending', 'in_progress', 'completed'].includes(value?.toLowerCase())) {
                updates.status = value.toLowerCase();
              }
              break;
            default:
              console.warn('[VoiceCoach] Unknown subtask field:', field);
          }

          if (Object.keys(updates).length > 0) {
            await updateSubtask(subtask.id, updates);
            console.log('[VoiceCoach] Subtask edited:', subtask.title, updates);
            forceContextUpdate();
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
    updateSessionTask,
    timerStore,
    refreshTasks,
    voiceCoachData,
    user,
    findTask,
    forceContextUpdate,
    userTags,
    refreshUserTags,
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

  // Helper to resolve taskId (handles currentTaskId special value)
  const resolveTaskId = useCallback((taskIdParam: string | undefined): string | null => {
    if (!taskIdParam || taskIdParam === 'currentTaskId') {
      return timerStore.activeTaskId || voiceCoachData.sessions.activeSessionTaskId || null;
    }
    const task = findTask(taskIdParam);
    return task?.id || null;
  }, [timerStore.activeTaskId, voiceCoachData.sessions.activeSessionTaskId, findTask]);

  // ElevenLabs conversation hook with Client Tools
  const conversation = useConversation({
    // ========== CLIENT TOOLS (executed silently, not spoken) ==========
    clientTools: {
      // ===== TIMER ACTIONS =====
      start_focus_session: async (params: { duration?: number }) => {
        const duration = params.duration || 25;
        await startSession({ duration });
        console.log('[VoiceCoach] Client Tool: start_focus_session', duration);
        return `Sesión de ${duration} minutos iniciada`;
      },
      pause_timer: async () => {
        timerStore.setIsRunning(false);
        console.log('[VoiceCoach] Client Tool: pause_timer');
        return 'Timer pausado';
      },
      resume_timer: async () => {
        if (timerStore.timeInSeconds > 0) {
          timerStore.setIsRunning(true);
        }
        console.log('[VoiceCoach] Client Tool: resume_timer');
        return 'Timer reanudado';
      },
      complete_session: async () => {
        await completeFocusSession();
        console.log('[VoiceCoach] Client Tool: complete_session');
        return 'Sesión completada';
      },

      // ===== TASK CRUD ACTIONS =====
      create_task: async (params: { title: string; priority?: number; description?: string }) => {
        if (!user) return 'Error: usuario no autenticado';
        if (!params.title?.trim()) return 'Error: título requerido';

        await createTask({
          user_id: user.id,
          title: params.title.trim(),
          priority: Math.min(Math.max(params.priority || 2, 1), 4),
          status: 'pending',
          description: params.description?.trim() || null,
          due_date: null,
          tags: [],
          ai_metadata: { created_by: 'voice_coach' }
        });
        console.log('[VoiceCoach] Client Tool: create_task', params.title);
        await refreshTasks();
        forceContextUpdate();
        return `Tarea "${params.title}" creada`;
      },

      complete_task: async (params: { taskId: string }) => {
        const task = findTask(params.taskId);
        if (!task) return 'Tarea no encontrada';

        await updateTask(task.id, { status: 'completed' });
        console.log('[VoiceCoach] Client Tool: complete_task', task.title);
        await refreshTasks();
        forceContextUpdate();
        return `Tarea "${task.title}" completada`;
      },

      edit_task: async (params: {
        taskId: string;
        // New format: direct fields from ElevenLabs
        title?: string;
        description?: string;
        priority?: string | number;
        due_date?: string;
        status?: string;
        // Legacy format: field/value
        field?: string;
        value?: string;
      }) => {
        const resolvedId = resolveTaskId(params.taskId);
        const task = resolvedId ? voiceCoachData.tasks.allPending.find(t => t.id === resolvedId) : findTask(params.taskId);
        if (!task) return 'Tarea no encontrada';

        const updates: Record<string, unknown> = {};

        // New format: direct fields from ElevenLabs
        if (params.title) {
          updates.title = params.title.trim();
        }
        if (params.description !== undefined) {
          updates.description = params.description?.trim() || null;
        }
        if (params.priority !== undefined) {
          // Handle both string ("high", "medium", "low") and number (1-4) formats
          const priorityMap: Record<string, number> = { high: 1, alta: 1, medium: 2, media: 2, low: 3, baja: 3 };
          const priorityValue = typeof params.priority === 'string'
            ? (priorityMap[params.priority.toLowerCase()] || parseInt(params.priority, 10))
            : params.priority;
          if (priorityValue >= 1 && priorityValue <= 4) {
            updates.priority = priorityValue;
          }
        }
        if (params.due_date !== undefined) {
          updates.due_date = params.due_date?.trim() || null;
        }
        if (params.status) {
          const statusLower = params.status.toLowerCase();
          if (['pending', 'in_progress', 'completed'].includes(statusLower)) {
            updates.status = statusLower;
          }
        }

        // Legacy format: field + value (fallback if no direct fields provided)
        if (params.field && params.value !== undefined && Object.keys(updates).length === 0) {
          switch (params.field.toLowerCase()) {
            case 'title':
            case 'titulo':
              updates.title = params.value.trim();
              break;
            case 'priority':
            case 'prioridad':
              const priorityMap: Record<string, number> = { high: 1, alta: 1, medium: 2, media: 2, low: 3, baja: 3 };
              const priorityNum = priorityMap[params.value.toLowerCase()] || parseInt(params.value, 10);
              if (priorityNum >= 1 && priorityNum <= 4) updates.priority = priorityNum;
              break;
            case 'description':
            case 'descripcion':
              updates.description = params.value.trim() || null;
              break;
            case 'due_date':
            case 'fecha':
              updates.due_date = params.value.trim() || null;
              break;
            case 'status':
            case 'estado':
              if (['pending', 'in_progress', 'completed'].includes(params.value.toLowerCase())) {
                updates.status = params.value.toLowerCase();
              }
              break;
          }
        }

        if (Object.keys(updates).length > 0) {
          await updateTask(task.id, updates);
          console.log('[VoiceCoach] Client Tool: edit_task', task.title, updates);
          await refreshTasks();
          forceContextUpdate();
          return `Tarea "${task.title}" actualizada`;
        }
        return 'No se especificaron campos válidos para actualizar';
      },

      delete_task: async (params: { taskId: string; confirmation: string }) => {
        if (params.confirmation?.toLowerCase() !== 'confirmar' && params.confirmation?.toLowerCase() !== 'confirm') {
          return 'Eliminación requiere confirmación';
        }
        const task = findTask(params.taskId);
        if (!task) return 'Tarea no encontrada';

        await deleteTask(task.id);
        console.log('[VoiceCoach] Client Tool: delete_task', task.title);
        await refreshTasks();
        forceContextUpdate();
        return `Tarea "${task.title}" eliminada`;
      },

      set_task_status: async (params: { taskId: string; status: string }) => {
        const resolvedId = resolveTaskId(params.taskId);
        const task = resolvedId ? voiceCoachData.tasks.allPending.find(t => t.id === resolvedId) : findTask(params.taskId);
        if (!task) return 'Tarea no encontrada';

        const validStatuses = ['pending', 'in_progress', 'completed'];
        const statusToSet = params.status?.toLowerCase().trim();
        if (!validStatuses.includes(statusToSet)) return 'Estado no válido';

        await updateTask(task.id, { status: statusToSet as 'pending' | 'in_progress' | 'completed' });
        console.log('[VoiceCoach] Client Tool: set_task_status', task.title, statusToSet);
        await refreshTasks();
        forceContextUpdate();
        return `Estado de "${task.title}" cambiado a ${statusToSet}`;
      },

      // ===== TAG ACTIONS =====
      add_tag_to_task: async (params: { taskId: string; tagName: string }) => {
        const resolvedId = resolveTaskId(params.taskId);
        const task = resolvedId ? voiceCoachData.tasks.allPending.find(t => t.id === resolvedId) : findTask(params.taskId);
        if (!task) return 'Tarea no encontrada';

        const tagToAdd = params.tagName?.trim().toLowerCase();
        if (!tagToAdd) return 'Nombre del tag requerido';

        const fullTask = await getTaskById(task.id);
        const currentTags = fullTask?.tags || [];

        if (!currentTags.includes(tagToAdd)) {
          await updateTask(task.id, {
            tags: [...currentTags, tagToAdd],
            priority: fullTask.priority,
            status: fullTask.status,
          });
          console.log('[VoiceCoach] Client Tool: add_tag_to_task', tagToAdd, task.title);
          await refreshTasks();
          forceContextUpdate();
          return `Tag "${tagToAdd}" agregado a "${task.title}"`;
        }
        return `Tag "${tagToAdd}" ya existe en la tarea`;
      },

      remove_tag_from_task: async (params: { taskId: string; tagName: string }) => {
        const resolvedId = resolveTaskId(params.taskId);
        const task = resolvedId ? voiceCoachData.tasks.allPending.find(t => t.id === resolvedId) : findTask(params.taskId);
        if (!task) return 'Tarea no encontrada';

        const tagToRemove = params.tagName?.trim().toLowerCase();
        if (!tagToRemove) return 'Nombre del tag requerido';

        const fullTask = await getTaskById(task.id);
        const currentTags = fullTask?.tags || [];
        const updatedTags = currentTags.filter((t: string) => t.toLowerCase() !== tagToRemove);

        if (updatedTags.length < currentTags.length) {
          await updateTask(task.id, {
            tags: updatedTags,
            priority: fullTask.priority,
            status: fullTask.status,
          });
          console.log('[VoiceCoach] Client Tool: remove_tag_from_task', tagToRemove, task.title);
          await refreshTasks();
          forceContextUpdate();
          return `Tag "${tagToRemove}" removido de "${task.title}"`;
        }
        return `Tag "${tagToRemove}" no encontrado en la tarea`;
      },

      create_tag: async (params: { name: string; color?: string }) => {
        if (!user) return 'Error: usuario no autenticado';
        const name = params.name?.trim();
        if (!name) return 'Nombre del tag requerido';

        const validColors: string[] = TAG_COLORS.map(c => c.name);
        const color = validColors.includes(params.color?.toLowerCase() || '') ? params.color!.toLowerCase() : 'blue';

        await createTag({ user_id: user.id, name, color });
        console.log('[VoiceCoach] Client Tool: create_tag', name, color);
        await refreshUserTags();
        return `Tag "${name}" creado con color ${color}`;
      },

      list_tags: async () => {
        const tagsList = userTags.map(t => `${t.name} (${t.color})`).join(', ');
        console.log('[VoiceCoach] Client Tool: list_tags');
        return tagsList || 'Sin tags';
      },

      delete_tag: async (params: { tagName: string; confirmation: string }) => {
        if (params.confirmation?.toLowerCase() !== 'confirmar' && params.confirmation?.toLowerCase() !== 'confirm') {
          return 'Eliminación requiere confirmación';
        }
        const tagToDelete = userTags.find(t => t.name.toLowerCase() === params.tagName?.toLowerCase().trim());
        if (!tagToDelete) return 'Tag no encontrado';

        await deleteTag(tagToDelete.id);
        console.log('[VoiceCoach] Client Tool: delete_tag', tagToDelete.name);
        await refreshUserTags();
        return `Tag "${tagToDelete.name}" eliminado`;
      },

      // ===== SESSION ACTIONS =====
      rate_session: async (params: { rating: number }) => {
        const rating = params.rating;
        const sessionId = voiceCoachData.sessions.activeSessionId;

        if (!sessionId) {
          const recentSession = voiceCoachData.sessions.todaySessions.find(s => s.status === 'completed');
          if (recentSession) {
            await rateSession(recentSession.id, rating);
            console.log('[VoiceCoach] Client Tool: rate_session (recent)', rating);
            return `Sesión calificada con ${rating} estrellas`;
          }
          return 'No hay sesión para calificar';
        }

        await rateSession(sessionId, rating);
        console.log('[VoiceCoach] Client Tool: rate_session', rating);
        return `Sesión calificada con ${rating} estrellas`;
      },

      add_session_note: async (params: { note: string }) => {
        const note = params.note?.trim();
        if (!note) return 'Texto de nota requerido';

        const sessionId = voiceCoachData.sessions.activeSessionId;
        if (!sessionId) {
          const recentSession = voiceCoachData.sessions.todaySessions.find(s => s.status === 'completed');
          if (recentSession) {
            await addSessionNote(recentSession.id, note);
            console.log('[VoiceCoach] Client Tool: add_session_note (recent)');
            return 'Nota agregada a la sesión';
          }
          return 'No hay sesión para agregar nota';
        }

        await addSessionNote(sessionId, note);
        console.log('[VoiceCoach] Client Tool: add_session_note');
        return 'Nota agregada a la sesión activa';
      },

      change_session_task: async (params: { taskId: string }) => {
        const task = findTask(params.taskId);
        if (!task) return 'Tarea no encontrada';

        await updateSessionTask(task.id);
        console.log('[VoiceCoach] Client Tool: change_session_task', task.title);
        forceContextUpdate();
        return `Sesión cambiada a "${task.title}"`;
      },

      // ===== SUBTASK ACTIONS =====
      create_subtask: async (params: { taskId?: string; title: string; priority?: number }) => {
        if (!user) return 'Error: usuario no autenticado';
        if (!params.title?.trim()) return 'Título de subtarea requerido';

        const taskId = resolveTaskId(params.taskId || 'currentTaskId');
        if (!taskId) return 'No hay tarea activa para agregar subtarea';

        await createSubtask({
          user_id: user.id,
          task_id: taskId,
          title: params.title.trim(),
          priority: params.priority || 2,
        });
        console.log('[VoiceCoach] Client Tool: create_subtask', params.title);
        forceContextUpdate();
        return `Subtarea "${params.title}" creada`;
      },

      complete_subtask: async (params: { subtaskId: string }) => {
        const subtask = voiceCoachData.subtasks.activeTaskSubtasks.find(
          s => s.id === params.subtaskId || s.title.toLowerCase().includes(params.subtaskId.toLowerCase())
        );
        if (!subtask) return 'Subtarea no encontrada';

        await updateSubtask(subtask.id, { status: SubtaskStatusEnum.COMPLETED });
        console.log('[VoiceCoach] Client Tool: complete_subtask', subtask.title);
        forceContextUpdate();
        return `Subtarea "${subtask.title}" completada`;
      },

      edit_subtask: async (params: { subtaskId: string; field: string; value: string }) => {
        const subtask = voiceCoachData.subtasks.activeTaskSubtasks.find(
          s => s.id === params.subtaskId || s.title.toLowerCase().includes(params.subtaskId?.toLowerCase() || '')
        );
        if (!subtask) return 'Subtarea no encontrada';

        const updates: Record<string, unknown> = {};
        switch (params.field?.toLowerCase()) {
          case 'title':
          case 'titulo':
            updates.title = params.value?.trim();
            break;
          case 'priority':
          case 'prioridad':
            const priorityNum = parseInt(params.value, 10);
            if (priorityNum >= 1 && priorityNum <= 4) updates.priority = priorityNum;
            break;
          case 'status':
          case 'estado':
            if (['pending', 'in_progress', 'completed'].includes(params.value?.toLowerCase())) {
              updates.status = params.value.toLowerCase();
            }
            break;
        }

        if (Object.keys(updates).length > 0) {
          await updateSubtask(subtask.id, updates);
          console.log('[VoiceCoach] Client Tool: edit_subtask', subtask.title, updates);
          forceContextUpdate();
          return `Subtarea "${subtask.title}" actualizada`;
        }
        return 'Campo no válido';
      },

      delete_subtask: async (params: { subtaskId: string }) => {
        const subtask = voiceCoachData.subtasks.activeTaskSubtasks.find(
          s => s.id === params.subtaskId || s.title.toLowerCase().includes(params.subtaskId.toLowerCase())
        );
        if (!subtask) return 'Subtarea no encontrada';

        await deleteSubtask(subtask.id);
        console.log('[VoiceCoach] Client Tool: delete_subtask', subtask.title);
        forceContextUpdate();
        return `Subtarea "${subtask.title}" eliminada`;
      },

      // ===== COMMENT ACTIONS =====
      add_comment: async (params: { taskId?: string; content: string }) => {
        if (!user) return 'Error: usuario no autenticado';
        if (!params.content?.trim()) return 'Texto del comentario requerido';

        const taskId = resolveTaskId(params.taskId || 'currentTaskId');
        if (!taskId) return 'No hay tarea para agregar comentario';

        await createComment({ user_id: user.id, task_id: taskId, content: params.content.trim() });
        console.log('[VoiceCoach] Client Tool: add_comment');
        return 'Comentario agregado';
      },

      list_comments: async (params: { taskId?: string }) => {
        const taskId = resolveTaskId(params.taskId || 'currentTaskId');
        if (!taskId) return 'No hay tarea especificada';

        const comments = await getCommentsByTaskId(taskId);
        console.log('[VoiceCoach] Client Tool: list_comments', comments.length);
        return comments.length > 0
          ? comments.map(c => c.content).join('; ')
          : 'Sin comentarios';
      },

      delete_comment: async (params: { commentId: string; confirmation: string }) => {
        if (params.confirmation?.toLowerCase() !== 'confirmar' && params.confirmation?.toLowerCase() !== 'confirm') {
          return 'Eliminación requiere confirmación';
        }
        if (!params.commentId?.trim()) return 'ID de comentario requerido';

        await deleteComment(params.commentId.trim());
        console.log('[VoiceCoach] Client Tool: delete_comment');
        return 'Comentario eliminado';
      },

      // ===== SEARCH/INFO ACTIONS =====
      search_task: async (params: { query: string }) => {
        if (!user) return 'Error: usuario no autenticado';
        const results = await searchTasks(user.id, params.query);
        console.log('[VoiceCoach] Client Tool: search_task', results.length);
        return results.slice(0, 5).map(t => t.title).join(', ') || 'Sin resultados';
      },

      get_task_details: async (params: { taskId: string }) => {
        const taskSummary = findTask(params.taskId);
        if (!taskSummary) return 'Tarea no encontrada';

        const fullTask = await getTaskById(taskSummary.id);
        console.log('[VoiceCoach] Client Tool: get_task_details', taskSummary.title);
        return fullTask
          ? `${fullTask.title} - P${fullTask.priority} - ${fullTask.status}${fullTask.description ? ` - ${fullTask.description}` : ''}`
          : 'Detalles no disponibles';
      },
    },

    // ========== CALLBACKS ==========
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
          // Parse and clean any remaining action markers (fallback)
          const { cleanText, actions } = parseActions(message.message);

          if (cleanText) {
            addMessage('assistant', cleanText);
          }

          // Execute any legacy actions found in the response (fallback for backwards compatibility)
          for (const action of actions) {
            console.log('[VoiceCoach] Legacy action marker detected:', action.name);
            executeAction(action);
          }
        }
      }
    },
    onUnhandledClientToolCall: (toolCall) => {
      console.warn('[VoiceCoach] Unhandled client tool call:', toolCall);
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
