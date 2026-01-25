import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const memoId = formData.get('memoId') as string;
    const language = (formData.get('language') as string) || 'es';

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo de audio' },
        { status: 400 }
      );
    }

    // Validate file size (25MB max for Whisper)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (audioFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'El archivo de audio es demasiado grande (máximo 25MB)' },
        { status: 400 }
      );
    }

    // Convert File to a format OpenAI can accept
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a File-like object for OpenAI
    const file = new File([buffer], audioFile.name || 'audio.webm', {
      type: audioFile.type || 'audio/webm',
    });

    // Transcribe using OpenAI Whisper (gpt-4o-transcribe model)
    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1', // Using whisper-1 as gpt-4o-transcribe may not be available
      language: language === 'es' ? 'es' : language,
      response_format: 'verbose_json',
      timestamp_granularities: ['segment'],
    });

    const transcription = transcriptionResponse.text;

    // Generate summary using GPT-4o-mini
    const summaryResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente que resume notas de voz de manera concisa y útil.
Genera un resumen breve (máximo 2-3 oraciones) que capture los puntos clave.
Si la nota menciona tareas o acciones, destácalas.
Responde solo con el resumen, sin introducciones ni explicaciones adicionales.
Responde en español.`,
        },
        {
          role: 'user',
          content: `Resume esta nota de voz:\n\n"${transcription}"`,
        },
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    const summary = summaryResponse.choices[0]?.message?.content?.trim() ||
      'No se pudo generar resumen';

    return NextResponse.json({
      transcription,
      summary,
      language,
      memoId,
      segments: transcriptionResponse.segments || [],
    });

  } catch (error) {
    console.error('Transcription API error:', error);

    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 400) {
        return NextResponse.json(
          { error: 'Formato de audio no soportado. Intenta con otro formato.' },
          { status: 400 }
        );
      }
      if (error.status === 413) {
        return NextResponse.json(
          { error: 'El archivo de audio es demasiado grande' },
          { status: 413 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Error al procesar la transcripción' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
