import OpenAI from 'openai';
import { SUGGEST_PROPERTIES_PROMPT, buildTaskContext } from '@/lib/ai/prompts';

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI();
  }
  return openai;
}

interface PropertySuggestion {
  priority: number;
  tags: string[];
  estimatedMinutes: number;
  reasoning: string;
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
        { role: 'system', content: SUGGEST_PROPERTIES_PROMPT },
        { role: 'user', content: buildTaskContext(task) },
      ],
    });

    const text = completion.choices[0]?.message?.content || '';

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const suggestion: PropertySuggestion = JSON.parse(jsonMatch[0]);

    // Validate and sanitize
    const validatedSuggestion = {
      priority: Math.min(4, Math.max(1, Number(suggestion.priority) || 2)),
      tags: Array.isArray(suggestion.tags)
        ? suggestion.tags.slice(0, 3).map(t => String(t).toLowerCase().trim())
        : [],
      estimatedMinutes: Number(suggestion.estimatedMinutes) || 30,
      reasoning: String(suggestion.reasoning || ''),
    };

    return new Response(JSON.stringify({ suggestion: validatedSuggestion }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI Suggest Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error generating suggestions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
