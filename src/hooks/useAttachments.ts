'use client';

import { useState, useEffect, useCallback } from 'react';
import { Attachment } from '@/types/attachments';
import {
  getAttachmentsByTaskId,
  uploadAttachment,
  deleteAttachment as deleteAttachmentApi,
  getSignedDownloadUrl,
  updateAttachmentDescription,
} from '@/lib/attachments';
import { useToast } from '@/components/ui/use-toast';

interface UseAttachmentsReturn {
  attachments: Attachment[];
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: Error | null;
  upload: (file: File, description?: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  download: (attachment: Attachment) => Promise<void>;
  updateDescription: (id: string, description: string | null) => Promise<void>;
  refresh: () => Promise<void>;
  imageCount: number;
  documentCount: number;
  totalCount: number;
}

export function useAttachments(
  taskId: string,
  userId: string | undefined
): UseAttachmentsReturn {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchAttachments = useCallback(async () => {
    if (!taskId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getAttachmentsByTaskId(taskId);
      setAttachments(data);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Error al cargar archivos adjuntos');
      setError(error);
      console.error('Error fetching attachments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  const upload = useCallback(
    async (file: File, description?: string) => {
      if (!userId || !taskId) {
        toast({
          title: 'Error',
          description: 'No se pudo subir el archivo',
          variant: 'destructive',
        });
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulate progress for better UX (actual upload doesn't provide progress events)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const newAttachment = await uploadAttachment({
          user_id: userId,
          task_id: taskId,
          file,
          description,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        setAttachments((prev) => [newAttachment, ...prev]);

        toast({
          title: 'Archivo subido',
          description: `${file.name} se ha adjuntado correctamente`,
        });
      } catch (err) {
        console.error('Error uploading attachment:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'No se pudo subir el archivo';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        throw err;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [userId, taskId, toast]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await deleteAttachmentApi(id);
        setAttachments((prev) => prev.filter((a) => a.id !== id));

        toast({
          title: 'Archivo eliminado',
          description: 'El archivo adjunto ha sido eliminado',
        });
      } catch (err) {
        console.error('Error deleting attachment:', err);
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el archivo',
          variant: 'destructive',
        });
        throw err;
      }
    },
    [toast]
  );

  const download = useCallback(
    async (attachment: Attachment) => {
      try {
        const signedUrl = await getSignedDownloadUrl(attachment.storage_path);

        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = signedUrl;
        link.download = attachment.file_name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Error downloading attachment:', err);
        toast({
          title: 'Error',
          description: 'No se pudo descargar el archivo',
          variant: 'destructive',
        });
        throw err;
      }
    },
    [toast]
  );

  const updateDescriptionHandler = useCallback(
    async (id: string, description: string | null) => {
      try {
        const updated = await updateAttachmentDescription(id, description);
        setAttachments((prev) =>
          prev.map((a) => (a.id === id ? updated : a))
        );
      } catch (err) {
        console.error('Error updating attachment description:', err);
        toast({
          title: 'Error',
          description: 'No se pudo actualizar la descripción',
          variant: 'destructive',
        });
        throw err;
      }
    },
    [toast]
  );

  const imageCount = attachments.filter((a) => a.file_type === 'image').length;
  const documentCount = attachments.filter((a) => a.file_type === 'document').length;
  const totalCount = attachments.length;

  return {
    attachments,
    isLoading,
    isUploading,
    uploadProgress,
    error,
    upload,
    remove,
    download,
    updateDescription: updateDescriptionHandler,
    refresh: fetchAttachments,
    imageCount,
    documentCount,
    totalCount,
  };
}
