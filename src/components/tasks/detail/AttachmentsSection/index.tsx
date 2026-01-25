'use client';

import { useState, useRef } from 'react';
import { ChevronDown, ChevronRight, Paperclip, Plus, Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Attachment } from '@/types/attachments';
import { AttachmentUploader } from './AttachmentUploader';
import { AttachmentsList } from './AttachmentsList';
import { AttachmentPreview } from './AttachmentPreview';

interface AttachmentsSectionProps {
  attachments: Attachment[];
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  totalCount: number;
  imageCount: number;
  documentCount: number;
  onUpload: (file: File, description?: string) => Promise<void>;
  onDownload: (attachment: Attachment) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function AttachmentsSection({
  attachments,
  isLoading,
  isUploading,
  uploadProgress,
  totalCount,
  imageCount,
  documentCount,
  onUpload,
  onDownload,
  onDelete,
}: AttachmentsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);

  const handleUpload = async (file: File, description?: string) => {
    await onUpload(file, description);
    setShowUploader(false);
  };

  const handleDelete = async (attachment: Attachment) => {
    await onDelete(attachment.id);
    // Close preview if the deleted attachment was being previewed
    if (previewAttachment?.id === attachment.id) {
      setPreviewAttachment(null);
    }
  };

  const handlePreview = (attachment: Attachment) => {
    if (attachment.file_type === 'image') {
      setPreviewAttachment(attachment);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDraggingOver(true);
      setIsExpanded(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDraggingOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await onUpload(files[0]);
    }
  };

  return (
    <>
      <div
        className="relative mt-6 border border-border rounded-lg overflow-hidden"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDraggingOver && (
          <div className="absolute inset-0 bg-accent/20 border-2 border-dashed border-accent rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <Upload className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-sm font-medium text-accent">Suelta el archivo aquí</p>
            </div>
          </div>
        )}

        {/* Header */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-secondary/50 transition-colors',
            isExpanded && 'border-b border-border'
          )}
        >
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">Archivos adjuntos</span>
            {totalCount > 0 && (
              <span className="text-sm text-muted-foreground">
                ({totalCount})
              </span>
            )}
          </div>

          {totalCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {imageCount > 0 && (
                <span>{imageCount} {imageCount === 1 ? 'imagen' : 'imágenes'}</span>
              )}
              {imageCount > 0 && documentCount > 0 && <span>·</span>}
              {documentCount > 0 && (
                <span>{documentCount} {documentCount === 1 ? 'documento' : 'documentos'}</span>
              )}
            </div>
          )}
        </button>

        {/* Content */}
        {isExpanded && (
          <div className="p-4 bg-card/50 space-y-4">
            {/* Add button */}
            {!showUploader && (
              <button
                type="button"
                onClick={() => setShowUploader(true)}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
                  'bg-secondary hover:bg-secondary/80 text-foreground'
                )}
              >
                <Plus className="h-4 w-4" />
                Adjuntar archivo
              </button>
            )}

            {/* Uploader */}
            {showUploader && (
              <AttachmentUploader
                onUpload={handleUpload}
                onCancel={() => setShowUploader(false)}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
              />
            )}

            {/* Attachments list */}
            {isLoading ? (
              <div className="py-4 text-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              </div>
            ) : attachments.length > 0 ? (
              <AttachmentsList
                attachments={attachments}
                onPreview={handlePreview}
                onDownload={onDownload}
                onDelete={handleDelete}
              />
            ) : (
              !showUploader && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay archivos adjuntos. Sube imágenes o documentos para
                  complementar tu tarea.
                </p>
              )
            )}
          </div>
        )}
      </div>

      {/* Preview modal */}
      {previewAttachment && (
        <AttachmentPreview
          attachment={previewAttachment}
          attachments={attachments}
          isOpen={true}
          onClose={() => setPreviewAttachment(null)}
          onDownload={onDownload}
          onNavigate={setPreviewAttachment}
        />
      )}
    </>
  );
}
