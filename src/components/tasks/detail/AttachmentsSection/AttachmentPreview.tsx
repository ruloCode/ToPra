'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, Download, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Attachment, formatFileSize } from '@/types/attachments';

interface AttachmentPreviewProps {
  attachment: Attachment;
  attachments: Attachment[];
  isOpen: boolean;
  onClose: () => void;
  onDownload: (attachment: Attachment) => void;
  onNavigate: (attachment: Attachment) => void;
}

export function AttachmentPreview({
  attachment,
  attachments,
  isOpen,
  onClose,
  onDownload,
  onNavigate,
}: AttachmentPreviewProps) {
  // Filter only images for navigation
  const imageAttachments = attachments.filter((a) => a.file_type === 'image');
  const currentIndex = imageAttachments.findIndex((a) => a.id === attachment.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < imageAttachments.length - 1;

  const handlePrevious = useCallback(() => {
    if (hasPrevious) {
      onNavigate(imageAttachments[currentIndex - 1]);
    }
  }, [hasPrevious, currentIndex, imageAttachments, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      onNavigate(imageAttachments[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, imageAttachments, onNavigate]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    },
    [isOpen, onClose, handlePrevious, handleNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const openInNewTab = () => {
    if (attachment.public_url) {
      window.open(attachment.public_url, '_blank');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white">
          <p className="font-medium truncate max-w-[200px] sm:max-w-none">
            {attachment.file_name}
          </p>
          <p className="text-sm text-white/70">
            {formatFileSize(attachment.file_size)}
            {imageAttachments.length > 1 && (
              <span className="ml-2">
                ({currentIndex + 1} / {imageAttachments.length})
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openInNewTab();
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Abrir en nueva pestaña"
          >
            <ExternalLink className="h-5 w-5 text-white" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(attachment);
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Descargar"
          >
            <Download className="h-5 w-5 text-white" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Cerrar (Esc)"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      {hasPrevious && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title="Anterior (←)"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title="Siguiente (→)"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {attachment.public_url && (
          <Image
            src={attachment.public_url}
            alt={attachment.file_name}
            width={1200}
            height={800}
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            unoptimized
            priority
          />
        )}
      </div>

      {/* Description */}
      {attachment.description && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/50 to-transparent">
          <p className="text-white/90 text-center text-sm">
            {attachment.description}
          </p>
        </div>
      )}
    </div>
  );
}
