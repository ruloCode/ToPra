'use client';

import Image from 'next/image';
import { Attachment } from '@/types/attachments';
import { AttachmentItem } from './AttachmentItem';

interface AttachmentsListProps {
  attachments: Attachment[];
  onPreview: (attachment: Attachment) => void;
  onDownload: (attachment: Attachment) => void;
  onDelete: (attachment: Attachment) => void;
}

export function AttachmentsList({
  attachments,
  onPreview,
  onDownload,
  onDelete,
}: AttachmentsListProps) {
  const images = attachments.filter((a) => a.file_type === 'image');
  const documents = attachments.filter((a) => a.file_type === 'document');

  return (
    <div className="space-y-4">
      {/* Image grid */}
      {images.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Imágenes ({images.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {images.map((attachment) => (
              <button
                key={attachment.id}
                type="button"
                onClick={() => onPreview(attachment)}
                className="group relative aspect-square rounded-lg overflow-hidden bg-secondary cursor-pointer hover:ring-2 hover:ring-accent transition-all"
              >
                {attachment.public_url && (
                  <Image
                    src={attachment.public_url}
                    alt={attachment.file_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    unoptimized
                  />
                )}
                {/* Overlay with actions on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-sm font-medium">
                    Ver imagen
                  </span>
                </div>
                {/* File name tooltip */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">
                    {attachment.file_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Documents list */}
      {documents.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Documentos ({documents.length})
          </h4>
          <div className="space-y-2">
            {documents.map((attachment) => (
              <AttachmentItem
                key={attachment.id}
                attachment={attachment}
                onPreview={onPreview}
                onDownload={onDownload}
                onDelete={() => onDelete(attachment)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mixed list if both exist - show images in list format too for consistency */}
      {images.length > 0 && documents.length === 0 && (
        <div className="hidden sm:block">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 mt-4">
            Lista de archivos
          </h4>
          <div className="space-y-2">
            {images.map((attachment) => (
              <AttachmentItem
                key={`list-${attachment.id}`}
                attachment={attachment}
                onPreview={onPreview}
                onDownload={onDownload}
                onDelete={() => onDelete(attachment)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
