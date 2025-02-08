'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';
import { Task } from '@/lib/tasks';

interface TaskModalContextType {
  openCreateTaskModal: (onSuccessCallback?: () => void, taskToEdit?: Task) => void;
  closeCreateTaskModal: () => void;
}

const TaskModalContext = createContext<TaskModalContextType | undefined>(undefined);

export function TaskModalProvider({ children }: { children: ReactNode }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | undefined>(undefined);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  const openCreateTaskModal = (callback?: () => void, task?: Task) => {
    setOnSuccessCallback(() => callback);
    setTaskToEdit(task);
    setIsCreateModalOpen(true);
  };

  const closeCreateTaskModal = () => {
    setIsCreateModalOpen(false);
    setOnSuccessCallback(undefined);
    setTaskToEdit(undefined);
  };

  return (
    <TaskModalContext.Provider value={{ openCreateTaskModal, closeCreateTaskModal }}>
      {children}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateTaskModal}
        onSuccess={() => {
          if (onSuccessCallback) {
            onSuccessCallback();
          }
          closeCreateTaskModal();
        }}
        taskToEdit={taskToEdit}
      />
    </TaskModalContext.Provider>
  );
}

export function useTaskModal() {
  const context = useContext(TaskModalContext);
  if (context === undefined) {
    throw new Error('useTaskModal must be used within a TaskModalProvider');
  }
  return context;
} 