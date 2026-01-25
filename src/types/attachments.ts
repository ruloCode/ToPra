export interface Attachment {
  id: string;
  user_id: string;
  task_id: string;
  file_name: string;
  file_size: number;
  file_type: AttachmentType;
  mime_type: string;
  storage_path: string;
  public_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type AttachmentType = 'image' | 'document';

export interface CreateAttachmentInput {
  user_id: string;
  task_id: string;
  file: File;
  description?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Allowed MIME types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
] as const;

export const ALL_ALLOWED_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
] as const;

// File size limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_ATTACHMENTS_PER_TASK = 20;

// Helper function to determine file type
export function getFileType(mimeType: string): AttachmentType {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return 'image';
  }
  return 'document';
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to get file extension
export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
}

// Helper function to validate file
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `El archivo excede el tamaño máximo de ${formatFileSize(MAX_FILE_SIZE)}`,
    };
  }

  if (!ALL_ALLOWED_TYPES.includes(file.type as (typeof ALL_ALLOWED_TYPES)[number])) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido. Usa imágenes (JPG, PNG, GIF, WebP) o documentos (PDF, Word, Excel, PowerPoint, TXT, CSV)',
    };
  }

  return { valid: true };
}
