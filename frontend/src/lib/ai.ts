import { Task } from './tasks';

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

    const data = await response.json();
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

    const data = await response.json();
    // Parse AI response and find the suggested task
    // This is a simplified example - we'll need to properly parse the AI response
    return tasks[0];
  } catch (error) {
    console.error('Error suggesting next task:', error);
    return null;
  }
} 