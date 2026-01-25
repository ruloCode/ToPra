import { supabase } from './supabase';
import {
  Attachment,
  CreateAttachmentInput,
  getFileType,
  validateFile,
  MAX_ATTACHMENTS_PER_TASK,
} from '@/types/attachments';

const BUCKET_NAME = 'task-attachments';

/**
 * Get all attachments for a specific task
 */
export async function getAttachmentsByTaskId(taskId: string): Promise<Attachment[]> {
  const { data, error } = await supabase
    .from('task_attachments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching attachments:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get attachment count for a task
 */
export async function getAttachmentCount(taskId: string): Promise<number> {
  const { count, error } = await supabase
    .from('task_attachments')
    .select('*', { count: 'exact', head: true })
    .eq('task_id', taskId);

  if (error) {
    console.error('Error counting attachments:', error);
    throw error;
  }

  return count || 0;
}

/**
 * Upload an attachment
 */
export async function uploadAttachment(
  input: CreateAttachmentInput
): Promise<Attachment> {
  const { user_id, task_id, file, description } = input;

  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Check attachment limit
  const currentCount = await getAttachmentCount(task_id);
  if (currentCount >= MAX_ATTACHMENTS_PER_TASK) {
    throw new Error(
      `Se ha alcanzado el límite máximo de ${MAX_ATTACHMENTS_PER_TASK} archivos adjuntos por tarea`
    );
  }

  // Generate unique file path: userId/taskId/timestamp_filename
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${user_id}/${task_id}/${timestamp}_${sanitizedFileName}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw new Error('Error al subir el archivo: ' + uploadError.message);
  }

  // Get public URL (for images we might want to show thumbnails)
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  // Create database record
  const fileType = getFileType(file.type);
  const { data, error: dbError } = await supabase
    .from('task_attachments')
    .insert([
      {
        user_id,
        task_id,
        file_name: file.name,
        file_size: file.size,
        file_type: fileType,
        mime_type: file.type,
        storage_path: storagePath,
        public_url: urlData?.publicUrl || null,
        description: description || null,
      },
    ])
    .select()
    .single();

  if (dbError) {
    // If db insert fails, try to clean up the uploaded file
    await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
    console.error('Error creating attachment record:', dbError);
    throw new Error('Error al guardar el archivo: ' + dbError.message);
  }

  return data;
}

/**
 * Delete an attachment
 */
export async function deleteAttachment(attachmentId: string): Promise<boolean> {
  // First get the attachment to get the storage path
  const { data: attachment, error: fetchError } = await supabase
    .from('task_attachments')
    .select('storage_path')
    .eq('id', attachmentId)
    .single();

  if (fetchError) {
    console.error('Error fetching attachment:', fetchError);
    throw new Error('No se pudo encontrar el archivo');
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([attachment.storage_path]);

  if (storageError) {
    console.error('Error deleting from storage:', storageError);
    // Continue to delete db record even if storage delete fails
  }

  // Delete database record
  const { error: dbError } = await supabase
    .from('task_attachments')
    .delete()
    .eq('id', attachmentId);

  if (dbError) {
    console.error('Error deleting attachment record:', dbError);
    throw new Error('Error al eliminar el archivo');
  }

  return true;
}

/**
 * Get a signed URL for downloading a file
 */
export async function getSignedDownloadUrl(
  storagePath: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, expiresIn);

  if (error) {
    console.error('Error creating signed URL:', error);
    throw new Error('Error al generar enlace de descarga');
  }

  return data.signedUrl;
}

/**
 * Update attachment description
 */
export async function updateAttachmentDescription(
  attachmentId: string,
  description: string | null
): Promise<Attachment> {
  const { data, error } = await supabase
    .from('task_attachments')
    .update({ description, updated_at: new Date().toISOString() })
    .eq('id', attachmentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating attachment:', error);
    throw new Error('Error al actualizar la descripción');
  }

  return data;
}

/**
 * Get attachment stats for a task
 */
export async function getAttachmentStats(
  taskId: string
): Promise<{ total: number; images: number; documents: number; totalSize: number }> {
  const { data, error } = await supabase
    .from('task_attachments')
    .select('file_type, file_size')
    .eq('task_id', taskId);

  if (error) {
    console.error('Error fetching attachment stats:', error);
    throw error;
  }

  const attachments = data || [];
  const images = attachments.filter((a) => a.file_type === 'image').length;
  const documents = attachments.filter((a) => a.file_type === 'document').length;
  const totalSize = attachments.reduce((sum, a) => sum + (a.file_size || 0), 0);

  return {
    total: attachments.length,
    images,
    documents,
    totalSize,
  };
}
