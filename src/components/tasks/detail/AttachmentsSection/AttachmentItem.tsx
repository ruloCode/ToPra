'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  Sparkles,
  Loader2,
  X,
  FileSearch,
  ListChecks,
  Type,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Attachment, formatFileSize } from '@/types/attachments';

interface AttachmentItemProps {
  attachment: Attachment;
  onPreview: (attachment: Attachment) => void;
  onDownload: (attachment: Attachment) => void;
  onDelete: (attachment: Attachment) => void;
  onExtractTasks?: (tasks: Array<{ title: string; priority: number }>) => void;
}

interface AnalysisResult {
  type: 'ocr' | 'describe' | 'extract_tasks' | 'summarize';
  result: string;
  extractedTasks?: Array<{ title: string; priority: number }>;
}

const fileIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  txt: FileText,
  default: File,
};

function getFileIcon(fileName: string, mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return FileImage;
  }

  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return fileIcons[extension] || fileIcons.default;
}

export function AttachmentItem({
  attachment,
  onPreview,
  onDownload,
  onDelete,
  onExtractTasks,
}: AttachmentItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const isImage = attachment.file_type === 'image';
  const Icon = getFileIcon(attachment.file_name, attachment.mime_type);

  // Analyze image with AI
  const analyzeImage = async (analysisType: 'ocr' | 'describe' | 'extract_tasks' | 'summarize') => {
    if (!attachment.public_url) return;

    setIsAnalyzing(true);
    setShowAIMenu(false);

    try {
      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: attachment.public_url,
          analysisType,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al analizar imagen');
      }

      const data = await response.json();
      setAnalysisResult({
        type: analysisType,
        result: data.result,
        extractedTasks: data.extractedTasks,
      });

      // If tasks were extracted and callback provided, offer to add them
      if (analysisType === 'extract_tasks' && data.extractedTasks?.length > 0 && onExtractTasks) {
        // Tasks will be shown in the result panel with option to add
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysisResult({
        type: analysisType,
        result: 'Error al analizar la imagen. Intenta de nuevo.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddExtractedTasks = () => {
    if (analysisResult?.extractedTasks && onExtractTasks) {
      onExtractTasks(analysisResult.extractedTasks);
      setAnalysisResult(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este archivo?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(attachment);
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 p-3 rounded-lg border border-border',
        'bg-card hover:bg-secondary/30 transition-colors',
        isDeleting && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Thumbnail or Icon */}
      {isImage && attachment.public_url ? (
        <button
          type="button"
          onClick={() => onPreview(attachment)}
          className="relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-secondary cursor-pointer hover:ring-2 hover:ring-accent transition-all"
        >
          <Image
            src={attachment.public_url}
            alt={attachment.file_name}
            fill
            className="object-cover"
            sizes="48px"
            unoptimized
          />
        </button>
      ) : (
        <div className="flex-shrink-0 w-12 h-12 rounded-md bg-secondary flex items-center justify-center">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {attachment.file_name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(attachment.file_size)}
        </p>
        {attachment.description && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {attachment.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isImage && (
          <>
            <button
              type="button"
              onClick={() => onPreview(attachment)}
              className="p-2 rounded-md hover:bg-secondary transition-colors"
              title="Vista previa"
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* AI Analysis button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAIMenu(!showAIMenu)}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  isAnalyzing
                    ? 'bg-accent/20'
                    : 'hover:bg-accent/10'
                )}
                title="Analizar con IA"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 text-accent animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 text-accent" />
                )}
              </button>

              {/* AI Analysis Menu */}
              {showAIMenu && (
                <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[180px]">
                  <button
                    type="button"
                    onClick={() => analyzeImage('ocr')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                  >
                    <Type className="h-4 w-4 text-muted-foreground" />
                    Extraer texto (OCR)
                  </button>
                  <button
                    type="button"
                    onClick={() => analyzeImage('describe')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                  >
                    <FileSearch className="h-4 w-4 text-muted-foreground" />
                    Describir imagen
                  </button>
                  <button
                    type="button"
                    onClick={() => analyzeImage('extract_tasks')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                  >
                    <ListChecks className="h-4 w-4 text-muted-foreground" />
                    Extraer tareas
                  </button>
                  <button
                    type="button"
                    onClick={() => analyzeImage('summarize')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Resumir contenido
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => onDownload(attachment)}
          className="p-2 rounded-md hover:bg-secondary transition-colors"
          title="Descargar"
        >
          <Download className="h-4 w-4 text-muted-foreground" />
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          title="Eliminar"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      </div>

      {/* AI Analysis Result Panel */}
      {analysisResult && (
        <div className="absolute left-0 right-0 top-full mt-2 z-10 bg-card border border-accent/30 rounded-lg shadow-lg p-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-accent">
                {analysisResult.type === 'ocr' && 'Texto extraído'}
                {analysisResult.type === 'describe' && 'Descripción'}
                {analysisResult.type === 'extract_tasks' && 'Tareas encontradas'}
                {analysisResult.type === 'summarize' && 'Resumen'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAnalysisResult(null)}
              className="p-1 hover:bg-secondary rounded transition-colors"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>

          <p className="text-sm text-foreground whitespace-pre-wrap">
            {analysisResult.result}
          </p>

          {/* Extracted tasks list */}
          {analysisResult.extractedTasks && analysisResult.extractedTasks.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="text-xs text-muted-foreground">
                {analysisResult.extractedTasks.length} tareas encontradas:
              </div>
              <ul className="space-y-1">
                {analysisResult.extractedTasks.map((task, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      task.priority === 4 && 'bg-red-500',
                      task.priority === 3 && 'bg-orange-500',
                      task.priority === 2 && 'bg-yellow-500',
                      task.priority === 1 && 'bg-green-500',
                    )} />
                    <span>{task.title}</span>
                  </li>
                ))}
              </ul>
              {onExtractTasks && (
                <button
                  type="button"
                  onClick={handleAddExtractedTasks}
                  className="w-full mt-2 px-3 py-1.5 text-xs bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
                >
                  Agregar como subtareas
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="sm:hidden p-2 rounded-md hover:bg-secondary transition-colors"
      >
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Mobile menu */}
      {showMenu && (
        <div className="sm:hidden absolute right-0 top-full mt-1 z-10 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[150px]">
          {isImage && (
            <button
              type="button"
              onClick={() => {
                onPreview(attachment);
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors"
            >
              <Eye className="h-4 w-4" />
              Vista previa
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onDownload(attachment);
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors"
          >
            <Download className="h-4 w-4" />
            Descargar
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
