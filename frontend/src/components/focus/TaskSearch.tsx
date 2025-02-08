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
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar tarea..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setTasks([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {selectedTask && (
        <Card className="p-3 flex justify-between items-center bg-primary/5">
          <div>
            <p className="font-medium">{selectedTask.title}</p>
            {selectedTask.description && (
              <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTaskSelect(null)}
            className="ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      )}

      {searchQuery && tasks.length > 0 && !selectedTask && (
        <Card className="absolute z-10 w-full max-h-60 overflow-y-auto">
          <div className="p-2 space-y-1">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => {
                  onTaskSelect(task);
                  setSearchQuery('');
                  setTasks([]);
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-primary/5 transition-colors"
              >
                <p className="font-medium">{task.title}</p>
                {task.description && (
                  <p className="text-sm text-muted-foreground truncate">
                    {task.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}

      {searchQuery && !isSearching && tasks.length === 0 && (
        <Card className="p-3 text-center text-muted-foreground">
          No se encontraron tareas
        </Card>
      )}
    </div>
  );
} 