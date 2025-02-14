"use client";

import { useEffect, useState, useRef } from "react";
import { Task, TaskStatus } from "@/lib/tasks";
import TaskCard from "./TaskCard";
import CreateTaskForm from "./CreateTaskForm";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onUpdate: () => void;
  onDelete: () => void;
  onEdit: (task: Task) => void;
  emptyMessage?: string;
  todayOnly?: boolean;
}

export default function TaskList({
  tasks: initialTasks,
  onUpdate,
  onDelete,
  onEdit,
  emptyMessage = "No tasks found",
  todayOnly = false,
}: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<"priority" | "dueDate">("priority");
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTasks(initialTasks || []);
    // Extraer todas las etiquetas únicas de las tareas
    const tags = new Set<string>();
    initialTasks?.forEach(task => {
      task.tags?.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags).sort());
  }, [initialTasks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
        setTagSearchQuery("");
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsTagDropdownOpen(false);
        setTagSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter((task) => {
    // Si hay búsqueda de texto, filtrar por ella
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return task.title.toLowerCase().includes(query) ||
             task.description?.toLowerCase().includes(query);
    }
    // Si hay tag seleccionado, filtrar por él
    if (selectedTag) {
      return task.tags?.includes(selectedTag);
    }
    return true;
  }).sort((a, b) => {
    // Ordenar primero por estado (pendientes arriba)
    if (a.status !== b.status) {
      return a.status === TaskStatus.COMPLETED ? 1 : -1;
    }
    // Si tienen el mismo estado, ordenar por fecha
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === "priority") {
      return (b.priority || 0) - (a.priority || 0);
    } else {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
  });

  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center dark:border-[#28282F]">
        <p className="text-muted-foreground">{emptyMessage}</p>
       
      </div>
    );
  }

  return (
    <div className="w-full max-w-full">
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full border-border dark:border-[#28282F]"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-sm font-medium text-text-secondary">
            {sortedTasks.length} {sortedTasks.length === 1 ? "task" : "tasks"}
            {selectedTag && <span className="ml-1">con etiqueta &quot;{selectedTag}&quot;</span>}
            {searchQuery && <span className="ml-1">coinciden con &quot;{searchQuery}&quot;</span>}
          </h2>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {availableTags.length > 0 && (
              <div className="relative w-full sm:w-auto" ref={tagDropdownRef}>
                <div
                  className="w-full sm:w-48 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground cursor-pointer flex items-center justify-between dark:border-[#28282F]"
                  onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                >
                  <span className="truncate">
                    {selectedTag || "All tags"}
                  </span>
                  {selectedTag && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTag("");
                      }}
                      className="p-1 hover:bg-accent/10 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                {isTagDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-background-paper border border-border rounded-md shadow-lg dark:border-[#28282F]">
                    <div className="p-2 bg-background">
                      <Input
                        type="text"
                        placeholder="Search tag..."
                        value={tagSearchQuery}
                        onChange={(e) => setTagSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full"
                      />
                    </div>
                    <div className="max-h-48 overflow-auto bg-white dark:bg-background-paper">
                      <div
                        className="px-2 py-1 hover:bg-accent/10 cursor-pointer text-sm text-foreground bg-background dark:bg-background-paper"
                        onClick={() => {
                          setSelectedTag("");
                          setIsTagDropdownOpen(false);
                          setTagSearchQuery("");
                        }}
                      >
                        All tags
                      </div>

                      {filteredTags.map(tag => (
                        <div
                          key={tag}
                          className="px-2 py-1 hover:bg-accent/10 cursor-pointer text-sm text-foreground bg-background dark:bg-background-paper"
                          onClick={() => {
                            setSelectedTag(tag);
                            setIsTagDropdownOpen(false);
                            setTagSearchQuery("");
                          }}
                        >
                          {tag}
                        </div>
                      ))}
                      
                    </div>
                  </div>
                )}
              </div>
            )}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "priority" | "dueDate")}
              className="w-full sm:w-auto rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground dark:bg-zinc-900 dark:text-white dark:border-[#28282F] [&>option]:dark:bg-zinc-900 [&>option]:bg-white"
            >
              <option value="priority">Sort by priority</option>
              <option value="dueDate">Sort by due date</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {editingTask && (
          <div className="mb-8 rounded-lg border bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              Edit Task
            </h2>
            <CreateTaskForm
              initialTask={editingTask}
              onSuccess={() => {
                setEditingTask(null);
                onUpdate();
              }}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        )}

        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron tareas que coincidan con tu búsqueda
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}
