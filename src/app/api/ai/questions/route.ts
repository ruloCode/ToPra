import OpenAI from 'openai';
import { GENERATE_QUESTIONS_PROMPT, buildTaskContext } from '@/lib/ai/prompts';

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI();
  }
  return openai;
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
        { role: 'system', content: GENERATE_QUESTIONS_PROMPT },
        { role: 'user', content: buildTaskContext(task) },
      ],
    });

    const text = completion.choices[0]?.message?.content || '';

    // Parse the JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const questions: string[] = JSON.parse(jsonMatch[0]);

    // Validate and clean the questions
    const validatedQuestions = questions
      .filter((q) => typeof q === 'string' && q.trim().length > 0)
      .map((q) => q.trim())
      .slice(0, 5); // Max 5 questions

    return new Response(JSON.stringify({ questions: validatedQuestions }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI Questions Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error generating questions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
