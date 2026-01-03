'use client';

import { useState, useRef, useEffect } from 'react';
import { useTags } from '@/contexts/TagContext';
import { Tag, TAG_COLORS, getTagColorClasses } from '@/lib/tags';
import TagEditor from './TagEditor';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tag as TagIcon, ChevronDown, X, Pencil, Plus } from 'lucide-react';

interface TagsDropdownProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  allowCreate?: boolean;
  showSelectedChips?: boolean;
  className?: string;
}

export default function TagsDropdown({
  selectedTags,
  onTagsChange,
  allowCreate = true,
  showSelectedChips = true,
  className,
}: TagsDropdownProps) {
  const { tags, isLoading, createTag } = useTags();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter tags based on search
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if search query matches any existing tag
  const canCreateNew =
    allowCreate &&
    searchQuery.trim() &&
    !tags.some((t) => t.name.toLowerCase() === searchQuery.toLowerCase().trim());

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter((t) => t !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const handleCreateTag = async () => {
    if (!searchQuery.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const newTag = await createTag(searchQuery.trim());
      onTagsChange([...selectedTags, newTag.name]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error creating tag:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canCreateNew) {
      e.preventDefault();
      handleCreateTag();
    }
  };

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setSearchQuery('');
      setEditingTag(null);
    }
  }, [isOpen]);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
              selectedTags.length > 0
                ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            <TagIcon className="h-3.5 w-3.5" />
            {selectedTags.length > 0 ? `${selectedTags.length} tags` : 'Tags'}
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56 p-0">
          {editingTag ? (
            <TagEditor
              tag={editingTag}
              onClose={() => setEditingTag(null)}
              onDelete={() => {
                // Remove from selected if it was selected
                if (selectedTags.includes(editingTag.name)) {
                  onTagsChange(selectedTags.filter((t) => t !== editingTag.name));
                }
              }}
            />
          ) : (
            <>
              {/* Search Input */}
              <div className="p-2 border-b border-border">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar o crear tag..."
                  className="w-full px-2 py-1.5 text-sm rounded-md border-2 border-border/50 dark:border-white/20 bg-white dark:bg-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                />
              </div>

              {/* Tags List */}
              <div className="max-h-48 overflow-y-auto py-1">
                {isLoading ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Cargando...
                  </div>
                ) : filteredTags.length === 0 && !canCreateNew ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No hay tags
                  </div>
                ) : (
                  <>
                    {filteredTags.map((tag) => {
                      const colorClasses = getTagColorClasses(tag.color);
                      const isSelected = selectedTags.includes(tag.name);

                      return (
                        <div
                          key={tag.id}
                          className="flex items-center justify-between px-2 py-1.5 hover:bg-muted/50 cursor-pointer group"
                        >
                          <button
                            type="button"
                            onClick={() => toggleTag(tag.name)}
                            className="flex items-center gap-2 flex-1 min-w-0"
                          >
                            <div
                              className={cn(
                                'h-3 w-3 rounded-full border-2 flex-shrink-0 transition-colors',
                                isSelected
                                  ? 'bg-accent border-accent'
                                  : 'border-muted-foreground'
                              )}
                            />
                            <span
                              className={cn(
                                'text-sm truncate px-1.5 py-0.5 rounded',
                                colorClasses.bg,
                                colorClasses.text
                              )}
                            >
                              {tag.name}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTag(tag);
                            }}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-muted rounded transition-all"
                          >
                            <Pencil className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </div>
                      );
                    })}

                    {/* Create New Tag Option */}
                    {canCreateNew && (
                      <button
                        type="button"
                        onClick={handleCreateTag}
                        disabled={isCreating}
                        className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 text-left"
                      >
                        <Plus className="h-3.5 w-3.5 text-accent" />
                        <span className="text-sm">
                          Crear{' '}
                          <span className="font-medium text-accent">
                            {searchQuery.trim()}
                          </span>
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">⏎</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Selected Tags Chips */}
      {showSelectedChips && selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((tagName) => {
            const tag = tags.find((t) => t.name === tagName);
            const colorClasses = tag
              ? getTagColorClasses(tag.color)
              : getTagColorClasses('blue');

            return (
              <span
                key={tagName}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                  colorClasses.bg,
                  colorClasses.text
                )}
              >
                {tagName}
                <button
                  type="button"
                  onClick={() => toggleTag(tagName)}
                  className="hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
