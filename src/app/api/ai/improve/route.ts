import OpenAI from 'openai';
import {
  IMPROVE_TEXT_PROMPT,
  EXPAND_TEXT_PROMPT,
  CONDENSE_TEXT_PROMPT,
  FIX_GRAMMAR_PROMPT,
} from '@/lib/ai/prompts';

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI();
  }
  return openai;
}

type ActionType = 'improve' | 'expand' | 'condense' | 'fix';

const ACTION_PROMPTS: Record<ActionType, string> = {
  improve: IMPROVE_TEXT_PROMPT,
  expand: EXPAND_TEXT_PROMPT,
  condense: CONDENSE_TEXT_PROMPT,
  fix: FIX_GRAMMAR_PROMPT,
};

export async function POST(req: Request) {
  try {
    const { text, action = 'improve' } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response('Text is required', { status: 400 });
    }

    const actionType = action as ActionType;
    const systemPrompt = ACTION_PROMPTS[actionType] || IMPROVE_TEXT_PROMPT;

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
    });

    const improvedText = completion.choices[0]?.message?.content || '';

    return new Response(
      JSON.stringify({
        original: text,
        improved: improvedText.trim(),
        action: actionType,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI Improve Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error improving text' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
