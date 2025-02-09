'use client';

import { useState, useEffect } from 'react';
import { Task, searchTasks } from '@/lib/tasks';
import { useAuth } from '@/components/AuthProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface TaskSearchProps {
  onTaskSelect: (task: Task | null) => void;
  selectedTask?: Task | null;
}

export function TaskSearch({ onTaskSelect, selectedTask }: TaskSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    async function performSearch() {
      if (!user || !debouncedSearch.trim()) {
        setTasks([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchTasks(user.id, debouncedSearch);
        setTasks(results);
      } catch (error) {
        console.error('Error searching tasks:', error);
      } finally {
        setIsSearching(false);
      }
    }

    performSearch();
  }, [debouncedSearch, user]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full relative">
        <Input
          type="text"
          placeholder="Buscar tarea..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm sm:text-base rounded-md border border-input bg-background"
        />
        {isSearching && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <span className="loading loading-spinner loading-sm" />
          </div>
        )}
      </div>

      {selectedTask && (
        <div className="flex items-center gap-2 p-2 rounded-md bg-accent/10">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm sm:text-base truncate">{selectedTask.title}</p>
            {selectedTask.description && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                {selectedTask.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto py-1 px-2 text-xs sm:text-sm"
            onClick={() => onTaskSelect(null)}
          >
            Quitar
          </Button>
        </div>
      )}

      {searchQuery && tasks.length > 0 && !selectedTask && (
        <ul className="mt-1 max-h-48 overflow-auto rounded-md border bg-popover p-2 shadow-md">
          {tasks.map((task) => (
            <li
              key={task.id}
              onClick={() => {
                onTaskSelect(task);
                setSearchQuery('');
                setTasks([]);
              }}
              className="cursor-pointer rounded-sm px-2 py-1.5 text-xs sm:text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <div className="font-medium">{task.title}</div>
              {task.description && (
                <div className="text-muted-foreground text-xs line-clamp-1">
                  {task.description}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {searchQuery && !isSearching && tasks.length === 0 && (
        <Card className="p-3 text-center text-muted-foreground">
          No se encontraron tareas
        </Card>
      )}
    </div>
  );
}