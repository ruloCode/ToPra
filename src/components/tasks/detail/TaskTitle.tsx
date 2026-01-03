'use client';

import { useState, useEffect } from 'react';

interface TaskTitleProps {
  title: string;
  onSave: (newTitle: string) => Promise<void>;
  isLoading?: boolean;
}

export function TaskTitle({ title, onSave, isLoading = false }: TaskTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(title);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitleInput(title);
  }, [title]);

  const handleSave = async () => {
    if (!titleInput.trim() || titleInput === title) {
      setIsEditing(false);
      setTitleInput(title);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(titleInput.trim());
      setIsEditing(false);
    } catch {
      setTitleInput(title);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitleInput(title);
  };

  if (isEditing) {
    return (
      <div className="space-y-2 mb-6">
        <input
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          className="text-2xl font-bold w-full border-b-2 border-accent bg-transparent outline-none p-1"
          placeholder="Titulo de la tarea"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1 text-xs rounded-md border border-border bg-background hover:bg-secondary/50"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1 text-xs rounded-md bg-accent text-white hover:bg-accent/90 flex items-center gap-1"
            disabled={isSaving || !titleInput.trim()}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <h1
      className="text-2xl font-bold text-foreground cursor-pointer hover:text-accent/80 transition-colors mb-6"
      onClick={() => !isLoading && setIsEditing(true)}
      title="Click para editar"
    >
      {title}
    </h1>
  );
}
