import { supabase } from './supabase';
import {
  VoiceMemo,
  CreateVoiceMemoInput,
  MAX_AUDIO_SIZE,
} from '@/types/voiceMemo';

const BUCKET_NAME = 'voice-memos';

/**
 * Get all voice memos for a task
 */
export async function getVoiceMemosByTaskId(taskId: string): Promise<VoiceMemo[]> {
  const { data, error } = await supabase
    .from('voice_memos')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching voice memos:', error);
    throw new Error('Error al cargar notas de voz');
  }

  return data as VoiceMemo[];
}

/**
 * Get a single voice memo by ID
 */
export async function getVoiceMemoById(memoId: string): Promise<VoiceMemo | null> {
  const { data, error } = await supabase
    .from('voice_memos')
    .select('*')
    .eq('id', memoId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching voice memo:', error);
    throw new Error('Error al cargar nota de voz');
  }

  return data as VoiceMemo;
}

/**
 * Upload a voice memo and create database entry
 */
export async function uploadVoiceMemo(input: CreateVoiceMemoInput): Promise<VoiceMemo> {
  const { user_id, task_id, audioBlob, duration_seconds, language = 'es' } = input;

  // Validate audio size
  if (audioBlob.size > MAX_AUDIO_SIZE) {
    throw new Error('El audio excede el tamaño máximo de 25MB');
  }

  // Generate unique filename
  const timestamp = Date.now();
  const extension = audioBlob.type.includes('webm') ? 'webm' :
                   audioBlob.type.includes('mp4') ? 'm4a' :
                   audioBlob.type.includes('wav') ? 'wav' : 'mp3';
  const fileName = `voice_memo_${timestamp}.${extension}`;
  const storagePath = `${user_id}/${task_id || 'general'}/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, audioBlob, {
      contentType: audioBlob.type,
      cacheControl: '3600',
    });

  if (uploadError) {
    console.error('Error uploading voice memo:', uploadError);
    throw new Error('Error al subir la nota de voz');
  }

  // Create database entry
  const { data, error: dbError } = await supabase
    .from('voice_memos')
    .insert({
      user_id,
      task_id: task_id || null,
      file_name: fileName,
      file_size: audioBlob.size,
      duration_seconds,
      mime_type: audioBlob.type,
      storage_path: storagePath,
      language,
      transcription_status: 'pending',
    })
    .select()
    .single();

  if (dbError) {
    // Cleanup uploaded file on DB error
    await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
    console.error('Error creating voice memo record:', dbError);
    throw new Error('Error al guardar la nota de voz');
  }

  return data as VoiceMemo;
}

/**
 * Delete a voice memo
 */
export async function deleteVoiceMemo(memoId: string): Promise<boolean> {
  // Get the memo first to get storage path
  const { data: memo, error: fetchError } = await supabase
    .from('voice_memos')
    .select('storage_path')
    .eq('id', memoId)
    .single();

  if (fetchError) {
    console.error('Error fetching voice memo for deletion:', fetchError);
    throw new Error('Error al eliminar la nota de voz');
  }

  // Delete from storage
  if (memo?.storage_path) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([memo.storage_path]);

    if (storageError) {
      console.error('Error deleting voice memo from storage:', storageError);
    }
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('voice_memos')
    .delete()
    .eq('id', memoId);

  if (dbError) {
    console.error('Error deleting voice memo record:', dbError);
    throw new Error('Error al eliminar la nota de voz');
  }

  return true;
}

/**
 * Get signed URL for audio playback
 */
export async function getVoiceMemoUrl(storagePath: string, expiresIn = 3600): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, expiresIn);

  if (error) {
    console.error('Error creating signed URL:', error);
    throw new Error('Error al obtener URL de reproducción');
  }

  return data.signedUrl;
}

/**
 * Update transcription data for a voice memo
 */
export async function updateVoiceMemoTranscription(
  memoId: string,
  transcription: string,
  summary: string
): Promise<VoiceMemo> {
  const { data, error } = await supabase
    .from('voice_memos')
    .update({
      transcription,
      transcription_summary: summary,
      transcription_status: 'completed',
    })
    .eq('id', memoId)
    .select()
    .single();

  if (error) {
    console.error('Error updating transcription:', error);
    throw new Error('Error al guardar transcripción');
  }

  return data as VoiceMemo;
}

/**
 * Mark transcription as failed
 */
export async function markTranscriptionFailed(
  memoId: string,
  errorMessage: string
): Promise<void> {
  const { error } = await supabase
    .from('voice_memos')
    .update({
      transcription_status: 'failed',
      transcription_error: errorMessage,
    })
    .eq('id', memoId);

  if (error) {
    console.error('Error marking transcription as failed:', error);
  }
}

/**
 * Get all voice memos for a user (for search/listing)
 */
export async function getUserVoiceMemos(
  userId: string,
  limit = 50
): Promise<VoiceMemo[]> {
  const { data, error } = await supabase
    .from('voice_memos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching user voice memos:', error);
    throw new Error('Error al cargar notas de voz');
  }

  return data as VoiceMemo[];
}

/**
 * Search voice memos by transcription content
 */
export async function searchVoiceMemos(
  userId: string,
  query: string
): Promise<VoiceMemo[]> {
  const { data, error } = await supabase
    .from('voice_memos')
    .select('*')
    .eq('user_id', userId)
    .or(`transcription.ilike.%${query}%,transcription_summary.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching voice memos:', error);
    throw new Error('Error al buscar notas de voz');
  }

  return data as VoiceMemo[];
}
