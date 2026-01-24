import OpenAI from 'openai';
import { buildVoiceCoachSystemPrompt, VOICE_COACH_TOOLS } from '@/lib/ai/voiceCoachPrompts';
import { VoiceCoachData } from '@/hooks/useVoiceCoachData';

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI();
  }
  return openai;
}

export interface VoiceChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ToolAction {
  name: string;
  params: Record<string, unknown>;
}

export interface VoiceChatResponse {
  text: string;
  actions?: ToolAction[];
}

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json() as {
      messages: VoiceChatMessage[];
      context: VoiceCoachData;
    };

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!context) {
      return new Response(
        JSON.stringify({ error: 'Context is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = buildVoiceCoachSystemPrompt(context);

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      tools: VOICE_COACH_TOOLS,
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 300, // Keep responses short for TTS
    });

    const responseMessage = completion.choices[0]?.message;

    if (!responseMessage) {
      throw new Error('No response from OpenAI');
    }

    // Check if there are tool calls
    const actions: ToolAction[] = [];
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      for (const toolCall of responseMessage.tool_calls) {
        // Handle different tool call types
        if (toolCall.type === 'function') {
          const func = toolCall.function;
          const functionName = func.name;
          let functionArgs: Record<string, unknown> = {};

          try {
            functionArgs = JSON.parse(func.arguments || '{}');
          } catch {
            functionArgs = {};
          }

          actions.push({
            name: functionName,
            params: functionArgs,
          });
        }
      }

      // If there are tool calls but no content, generate a follow-up response
      if (!responseMessage.content) {
        // Create a brief confirmation message based on the action
        const actionConfirmations = actions.map(action => {
          switch (action.name) {
            case 'start_focus_session':
              return `Iniciando sesión de ${action.params.duration || 25} minutos. ¡Vamos!`;
            case 'pause_timer':
              return 'Sesión pausada. Tómate un momento.';
            case 'resume_timer':
              return '¡Continuamos! La sesión está activa de nuevo.';
            case 'complete_session':
              return '¡Sesión completada! Excelente trabajo.';
            case 'complete_task':
              return `¡Tarea completada! ${action.params.taskTitle ? `"${action.params.taskTitle}"` : ''} Bien hecho.`;
            default:
              return 'Listo.';
          }
        });

        const response: VoiceChatResponse = {
          text: actionConfirmations.join(' '),
          actions,
        };

        return new Response(JSON.stringify(response), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const response: VoiceChatResponse = {
      text: responseMessage.content || 'No pude procesar tu solicitud. ¿Puedes repetir?',
      actions: actions.length > 0 ? actions : undefined,
    };

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Voice Chat Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Error processing voice request',
        text: 'Lo siento, tuve un problema. ¿Puedes intentar de nuevo?',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
