import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 60; // Allow up to 60 seconds for image analysis

interface AnalysisRequest {
  imageUrl: string;
  analysisType: 'ocr' | 'describe' | 'extract_tasks' | 'summarize';
  context?: string;
}

interface AnalysisResponse {
  result: string;
  extractedTasks?: Array<{ title: string; priority: number }>;
  confidence: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    const { imageUrl, analysisType, context } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL de imagen requerida' },
        { status: 400 }
      );
    }

    // Build prompt based on analysis type
    let systemPrompt = '';
    let userPrompt = '';

    switch (analysisType) {
      case 'ocr':
        systemPrompt = `Eres un asistente de OCR experto. Extrae TODO el texto visible en la imagen.
Responde SOLO con el texto extraído, manteniendo el formato original lo más posible.
Si hay texto en múltiples idiomas, extrae todo.
Si no hay texto legible, responde "No se detectó texto en la imagen."`;
        userPrompt = 'Extrae todo el texto de esta imagen:';
        break;

      case 'describe':
        systemPrompt = `Eres un asistente visual experto. Describe la imagen de manera concisa y útil.
Enfócate en:
- Elementos principales
- Texto visible (si hay)
- Diagramas o estructuras (si hay)
- Información relevante para productividad

Responde en español, máximo 3-4 oraciones.`;
        userPrompt = context
          ? `Describe esta imagen en el contexto de: "${context}"`
          : 'Describe esta imagen:';
        break;

      case 'extract_tasks':
        systemPrompt = `Eres un asistente de productividad experto. Analiza la imagen y extrae tareas o acciones.

IMPORTANTE:
- Busca listas de pendientes, notas, pizarras, etc.
- Identifica tareas implícitas (ej: en un diagrama, los pasos a completar)
- Asigna prioridad: 1=baja, 2=media, 3=alta, 4=urgente

Responde en formato JSON:
{
  "tasks": [
    { "title": "Nombre de la tarea", "priority": 2 }
  ],
  "notes": "Notas adicionales sobre el contexto"
}

Si no hay tareas detectables, responde:
{ "tasks": [], "notes": "No se detectaron tareas en la imagen" }`;
        userPrompt = context
          ? `Extrae tareas de esta imagen. Contexto: "${context}"`
          : 'Extrae tareas o acciones de esta imagen:';
        break;

      case 'summarize':
        systemPrompt = `Eres un asistente de productividad. Resume el contenido de la imagen.
- Si es un documento, extrae los puntos clave
- Si es un diagrama, explica el flujo
- Si es una captura de pantalla, describe lo relevante
- Si son notas, sintetiza las ideas principales

Responde en español, de manera concisa (máximo 5 oraciones).`;
        userPrompt = context
          ? `Resume esta imagen. Contexto: "${context}"`
          : 'Resume el contenido de esta imagen:';
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de análisis no válido' },
          { status: 400 }
        );
    }

    // Call GPT-4o Vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high', // Use high detail for better OCR
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const result = response.choices[0]?.message?.content || '';

    // Parse response based on analysis type
    const analysisResponse: AnalysisResponse = {
      result,
      confidence: 0.9, // GPT-4o Vision is generally reliable
    };

    // For task extraction, parse JSON
    if (analysisType === 'extract_tasks') {
      try {
        // Clean the response (remove markdown code blocks if present)
        const cleanedResult = result
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        const parsed = JSON.parse(cleanedResult);
        analysisResponse.extractedTasks = parsed.tasks || [];
        analysisResponse.result = parsed.notes || 'Tareas extraídas correctamente';
      } catch {
        // If JSON parsing fails, return raw result
        analysisResponse.extractedTasks = [];
        analysisResponse.result = result;
        analysisResponse.confidence = 0.6;
      }
    }

    return NextResponse.json(analysisResponse);

  } catch (error) {
    console.error('Image analysis error:', error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 400) {
        return NextResponse.json(
          { error: 'No se pudo procesar la imagen. Verifica que sea un formato válido.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Error al analizar la imagen' },
      { status: 500 }
    );
  }
}
