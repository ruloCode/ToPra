import { Task, TaskStatus } from './tasks';

const DEEPSEEK_API_URL = process.env.NEXT_PUBLIC_DEEPSEEK_API_URL;
const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

interface PriorityScore {
  score: number;
  reasoning: string;
  suggestedPriority: 1 | 2 | 3;
}

interface TaskMetadata {
  category?: string;
  estimatedDuration?: string;
  suggestedTags: string[];
  complexity: 'low' | 'medium' | 'high';
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
  extractedTask?: Partial<Task>;
  suggestedActions?: {
    type: 'create_task' | 'update_priority' | 'set_due_date';
    data: {
      priority?: number;
      dueDate?: string;
      taskId?: string;
    };
  }[];
}

export async function analyzePriority(task: Task): Promise<PriorityScore> {
  const prompt = `
    Analyze the following task and determine its priority level:
    Title: ${task.title}
    Description: ${task.description || 'No description provided'}
    Due Date: ${task.due_date || 'No due date'}
    Current Priority: ${task.priority}

    Consider the following factors:
    1. Urgency (based on due date)
    2. Importance (based on title and description)
    3. Current priority level
    4. Task complexity

    Provide a priority score (1-100), reasoning, and suggested priority level (1-3).
  `;

  try {
    const response = await fetch(DEEPSEEK_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a task prioritization assistant. Analyze tasks and provide priority recommendations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze task priority');
    }

    const data = await response.json();
    // Parse AI response and extract priority information
    // This is a simplified example - we'll need to properly parse the AI response
    return {
      score: 75,
      reasoning: data.choices[0].message.content,
      suggestedPriority: 2,
    };
  } catch (error) {
    console.error('Error analyzing task priority:', error);
    // Fallback to default priority score
    return {
      score: 50,
      reasoning: 'Failed to analyze priority. Using default score.',
      suggestedPriority: task.priority as 1 | 2 | 3,
    };
  }
}

export async function extractTaskMetadata(title: string, description?: string): Promise<TaskMetadata> {
  const prompt = `
    Analyze the following task and extract key metadata:
    Title: ${title}
    Description: ${description || 'No description provided'}

    Extract the following information:
    1. Task category
    2. Estimated duration
    3. Relevant tags
    4. Task complexity level
  `;

  try {
    const response = await fetch(DEEPSEEK_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a task analysis assistant. Extract relevant metadata from task descriptions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to extract task metadata');
    }

    // Parse AI response and extract metadata
    // This is a simplified example - we'll need to properly parse the AI response
    return {
      category: 'Work',
      estimatedDuration: '1 hour',
      suggestedTags: ['work', 'project'],
      complexity: 'medium',
    };
  } catch (error) {
    console.error('Error extracting task metadata:', error);
    // Fallback to default metadata
    return {
      suggestedTags: [],
      complexity: 'medium',
    };
  }
}

export async function suggestNextTask(tasks: Task[]): Promise<Task | null> {
  const prompt = `
    Analyze the following tasks and suggest which one should be tackled next:
    ${tasks.map(task => `
      Title: ${task.title}
      Description: ${task.description || 'No description'}
      Priority: ${task.priority}
      Due Date: ${task.due_date || 'No due date'}
      Status: ${task.status}
    `).join('\n')}

    Consider the following factors:
    1. Task priority
    2. Due dates
    3. Task dependencies
    4. Current task status
    5. Time of day and estimated duration
  `;

  try {
    const response = await fetch(DEEPSEEK_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a task prioritization assistant. Help users decide which task to work on next.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to suggest next task');
    }

    // Parse AI response and find the suggested task
    // This is a simplified example - we'll need to properly parse the AI response
    return tasks[0];
  } catch (error) {
    console.error('Error suggesting next task:', error);
    return null;
  }
}

function extractActionsFromMessage(message: string): ChatResponse['suggestedActions'] {
  const actions: ChatResponse['suggestedActions'] = [];

  // Check for priority suggestions
  const priorityMatch = message.match(/sugerir prioridad:?\s*(\d)/i);
  if (priorityMatch) {
    actions.push({
      type: 'update_priority',
      data: { priority: parseInt(priorityMatch[1]) },
    });
  }

  // Check for due date suggestions
  const dueDateMatch = message.match(/fecha límite:?\s*"([^"]+)"/i);
  if (dueDateMatch) {
    actions.push({
      type: 'set_due_date',
      data: { dueDate: dueDateMatch[1] },
    });
  }

  return actions;
}

export async function getChatResponse(messages: ChatMessage[]): Promise<ChatResponse> {
  try {
    if (!DEEPSEEK_API_URL || !DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API configuration is missing');
    }

    console.log('Sending request to DeepSeek API:', {
      url: DEEPSEEK_API_URL,
      messages: messages,
    });

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente de gestión de tareas que habla español. 
            Cuando el usuario quiera crear una tarea, responde en este formato exacto:
            TASK_START
            título: "título de la tarea"
            descripción: "descripción detallada"
            prioridad: (1-3)
            fecha límite: "YYYY-MM-DD"
            etiquetas: tag1, tag2, tag3
            TASK_END
            
            Luego añade tu respuesta conversacional normal.
            
            Ejemplo de respuesta:
            TASK_START
            título: "Estudiar para el examen de matemáticas"
            descripción: "Repasar los temas de álgebra y geometría"
            prioridad: 2
            fecha límite: "2024-02-20"
            etiquetas: estudio, matemáticas, examen
            TASK_END
            
            Entiendo. He creado una tarea para tu estudio. ¿Necesitas que ajuste algún detalle?`,
          },
          ...messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('DeepSeek API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('DeepSeek API response:', data);

    const aiMessage = data.choices[0].message.content;
    const extractedTask = extractTaskFromMessage(aiMessage);

    console.log('Extracted task:', extractedTask);

    return {
      message: aiMessage.replace(/TASK_START[\s\S]*?TASK_END\n?/g, '').trim(),
      extractedTask,
      suggestedActions: extractActionsFromMessage(aiMessage),
    };
  } catch (error) {
    console.error('Error in chat response:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Error al comunicarse con el asistente de IA'
    );
  }
}

function extractTaskFromMessage(message: string): Partial<Task> | undefined {
  try {
    const taskMatch = message.match(/TASK_START([\s\S]*?)TASK_END/);
    if (!taskMatch) {
      console.log('No task data found in message');
      return undefined;
    }

    const taskContent = taskMatch[1];
    console.log('Found task content:', taskContent);

    const titleMatch = taskContent.match(/título:\s*"([^"]+)"/i);
    const descriptionMatch = taskContent.match(/descripción:\s*"([^"]+)"/i);
    const priorityMatch = taskContent.match(/prioridad:\s*(\d)/i);
    const dueDateMatch = taskContent.match(/fecha límite:\s*"([^"]+)"/i);
    const tagsMatch = taskContent.match(/etiquetas:\s*([^\n]+)/i);

    if (!titleMatch) {
      console.log('No title found in task content');
      return undefined;
    }

    const tags = tagsMatch ? 
      tagsMatch[1].split(',').map(tag => tag.trim()).filter(Boolean) : 
      [];

    const task = {
      title: titleMatch[1],
      description: descriptionMatch?.[1] || null,
      priority: priorityMatch ? parseInt(priorityMatch[1]) : 2,
      due_date: dueDateMatch?.[1] || null,
      status: TaskStatus.PENDING,
      tags,
    };

    console.log('Extracted task data:', task);
    return task;
  } catch (error) {
    console.error('Error extracting task data:', error);
    return undefined;
  }
}