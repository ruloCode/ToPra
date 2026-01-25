'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  validateFile,
  formatFileSize,
  MAX_FILE_SIZE,
  ALL_ALLOWED_TYPES,
} from '@/types/attachments';

interface AttachmentUploaderProps {
  onUpload: (file: File, description?: string) => Promise<void>;
  onCancel: () => void;
  isUploading: boolean;
  uploadProgress: number;
}

export function AttachmentUploader({
  onUpload,
  onCancel,
  isUploading,
  uploadProgress,
}: AttachmentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Archivo no válido');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await onUpload(selectedFile, description || undefined);
      // Reset form after successful upload
      setSelectedFile(null);
      setDescription('');
      onCancel();
    } catch {
      // Error is handled in the hook
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border border-border">
      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed transition-colors cursor-pointer',
          isDragging
            ? 'border-accent bg-accent/10'
            : 'border-muted-foreground/30 hover:border-muted-foreground/50',
          selectedFile && 'border-green-500 bg-green-500/10 cursor-default'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleInputChange}
          accept={ALL_ALLOWED_TYPES.join(',')}
          className="hidden"
          disabled={isUploading}
        />

        {selectedFile ? (
          <div className="flex items-center gap-3 text-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            {!isUploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearFile();
                }}
                className="p-1 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              {isDragging ? (
                'Suelta el archivo aquí'
              ) : (
                <>
                  Arrastra un archivo o{' '}
                  <span className="text-accent font-medium">
                    haz clic para seleccionar
                  </span>
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Máximo {formatFileSize(MAX_FILE_SIZE)}. Imágenes, PDF, Word, Excel,
              PowerPoint, TXT, CSV
            </p>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-2">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}

      {/* Description input */}
      {selectedFile && !isUploading && (
        <div>
          <label
            htmlFor="attachment-description"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Descripción (opcional)
          </label>
          <input
            id="attachment-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Agrega una descripción..."
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            maxLength={500}
          />
        </div>
      )}

      {/* Progress bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subiendo...</span>
            <span className="text-muted-foreground">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isUploading}
          className="px-3 py-1.5 text-sm rounded-md bg-secondary hover:bg-secondary/80 text-foreground disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2',
            'bg-accent hover:bg-accent/90 text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Subiendo
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Subir archivo
            </>
          )}
        </button>
      </div>
    </div>
  );
}
