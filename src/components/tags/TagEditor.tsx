'use client';

import { useState } from 'react';
import { Tag, TAG_COLORS, TagColorName } from '@/lib/tags';
import { useTags } from '@/contexts/TagContext';
import { cn } from '@/lib/utils';
import { X, Check, Trash2 } from 'lucide-react';

interface TagEditorProps {
  tag: Tag;
  onClose: () => void;
  onDelete?: () => void;
}

export default function TagEditor({ tag, onClose, onDelete }: TagEditorProps) {
  const { updateTag, deleteTag } = useTags();
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await updateTag(tag.id, { name: name.trim(), color });
      onClose();
    } catch (error) {
      console.error('Error updating tag:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteTag(tag.id);
      onDelete?.();
      onClose();
    } catch (error) {
      console.error('Error deleting tag:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-3 space-y-3 min-w-[200px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Editar tag</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Name Input */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-2 py-1.5 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Nombre del tag"
        />
      </div>

      {/* Color Picker */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Color</label>
        <div className="grid grid-cols-4 gap-1.5">
          {TAG_COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c.name)}
              className={cn(
                'h-6 w-6 rounded-full flex items-center justify-center transition-all',
                c.dot,
                color === c.name && 'ring-2 ring-offset-2 ring-offset-background ring-accent'
              )}
            >
              {color === c.name && <Check className="h-3 w-3 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        {showDeleteConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-destructive">¿Eliminar?</span>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="text-xs text-destructive hover:underline"
            >
              Sí
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs text-muted-foreground hover:underline"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={isLoading || !name.trim()}
          className="px-3 py-1.5 text-xs font-medium bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}
