import OpenAI from 'openai';
import { SUBTASKS_PROMPT, buildTaskContext } from '@/lib/ai/prompts';

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI();
  }
  return openai;
}

interface SubtaskSuggestion {
  title: string;
  priority: number;
}

export async function POST(req: Request) {
  try {
    const { task } = await req.json();

    if (!task || !task.title) {
      return new Response('Task with title is required', { status: 400 });
    }

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SUBTASKS_PROMPT },
        { role: 'user', content: buildTaskContext(task) },
      ],
    });

    const text = completion.choices[0]?.message?.content || '';

    // Parse the JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const subtasks: SubtaskSuggestion[] = JSON.parse(jsonMatch[0]);

    // Validate the structure
    const validatedSubtasks = subtasks.map((st, index) => ({
      title: String(st.title || `Subtarea ${index + 1}`),
      priority: Math.min(4, Math.max(1, Number(st.priority) || 2)),
    }));

    return new Response(JSON.stringify({ subtasks: validatedSubtasks }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI Subtasks Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error generating subtasks' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
