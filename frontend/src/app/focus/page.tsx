'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FocusMode } from '@/components/focus/FocusMode';
import { getTaskById } from '@/lib/tasks';
import type { Task } from '@/lib/tasks';

export default function FocusPage() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (taskId) {
      getTaskById(taskId)
        .then(setTask)
        .catch(console.error);
    }
  }, [taskId]);

  return (
    <main className="min-h-screen bg-background">
      <FocusMode task={task || undefined} />
    </main>
  );
} 