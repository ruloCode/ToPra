import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

// API para finalizar sesiones de focus cuando el usuario cierra el navegador
// Usa sendBeacon desde el cliente, por lo que debe ser rápida y confiable

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validar que tenemos los campos necesarios
    if (!body.status || !body.end_time) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validar que el status es válido
    const validStatuses = ['completed', 'interrupted'];
    if (!validStatuses.includes(body.status)) {
      return Response.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Crear cliente con service role para bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Actualizar la sesión
    const { error } = await supabase
      .from('focus_sessions')
      .update({
        status: body.status,
        end_time: body.end_time,
        duration: body.duration || null,
      })
      .eq('id', id)
      .eq('status', 'active'); // Solo actualizar si está activa (prevenir duplicados)

    if (error) {
      console.error('Error updating focus session:', error);
      return Response.json(
        { error: 'Failed to update session' },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error in finalize API:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
