'use client';

import { useState } from 'react';
import { useTags } from '@/contexts/TagContext';
import { TAG_COLORS, getTagColorClasses } from '@/lib/tags';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, Check, X, Tag as TagIcon } from 'lucide-react';

export default function TagManager() {
  const { tags, isLoading, createTag, updateTag, deleteTag } = useTags();
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('blue');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newTagName.trim()) return;

    setIsSaving(true);
    try {
      await createTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setNewTagColor('blue');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating tag:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEdit = (tagId: string, name: string, color: string) => {
    setEditingTagId(tagId);
    setEditName(name);
    setEditColor(color);
  };

  const handleSaveEdit = async () => {
    if (!editingTagId || !editName.trim()) return;

    setIsSaving(true);
    try {
      await updateTag(editingTagId, { name: editName.trim(), color: editColor });
      setEditingTagId(null);
    } catch (error) {
      console.error('Error updating tag:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    setIsSaving(true);
    try {
      await deleteTag(tagId);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting tag:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Etiquetas</h2>
        </div>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TagIcon className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Etiquetas</h2>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/10 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva etiqueta
          </button>
        )}
      </div>

      {/* Create new tag form */}
      {isCreating && (
        <div className="p-4 border border-border rounded-lg bg-card space-y-3">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Nombre</label>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Nombre de la etiqueta"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-accent"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
                if (e.key === 'Escape') setIsCreating(false);
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Color</label>
            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setNewTagColor(color.name)}
                  className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center transition-all',
                    color.dot,
                    newTagColor === color.name && 'ring-2 ring-offset-2 ring-offset-background ring-accent'
                  )}
                >
                  {newTagColor === color.name && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                setIsCreating(false);
                setNewTagName('');
                setNewTagColor('blue');
              }}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={isSaving || !newTagName.trim()}
              className="px-3 py-1.5 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </div>
      )}

      {/* Tags list */}
      <div className="space-y-2">
        {tags.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <TagIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No tienes etiquetas creadas</p>
            <button
              onClick={() => setIsCreating(true)}
              className="mt-2 text-sm text-accent hover:text-accent/80"
            >
              Crear tu primera etiqueta
            </button>
          </div>
        ) : (
          tags.map((tag) => {
            const colorClasses = getTagColorClasses(tag.color);
            const isEditing = editingTagId === tag.id;
            const isDeleting = deleteConfirmId === tag.id;

            return (
              <div
                key={tag.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg bg-card hover:border-border/80 transition-colors"
              >
                {isEditing ? (
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-accent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') setEditingTagId(null);
                      }}
                    />
                    <div className="flex gap-1">
                      {TAG_COLORS.map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setEditColor(color.name)}
                          className={cn(
                            'h-5 w-5 rounded-full transition-all',
                            color.dot,
                            editColor === color.name && 'ring-2 ring-offset-1 ring-offset-background ring-accent'
                          )}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingTagId(null)}
                      className="p-1.5 text-muted-foreground hover:bg-muted rounded transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className={cn('h-3 w-3 rounded-full', colorClasses.dot)} />
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-sm font-medium',
                          colorClasses.bg,
                          colorClasses.text
                        )}
                      >
                        {tag.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isDeleting ? (
                        <>
                          <span className="text-xs text-destructive mr-2">¿Eliminar?</span>
                          <button
                            onClick={() => handleDelete(tag.id)}
                            disabled={isSaving}
                            className="px-2 py-1 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
                          >
                            Sí
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 text-xs text-muted-foreground hover:bg-muted rounded transition-colors"
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(tag.id, tag.name, tag.color)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(tag.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
