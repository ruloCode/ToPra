'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { FocusMode } from '@/components/focus/FocusMode';
import { getTaskById } from '@/lib/tasks';
import type { Task } from '@/lib/tasks';

function FocusPageContent() {
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

  return <FocusMode task={task || undefined} />;
}

export default function FocusPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <FocusPageContent />
      </Suspense>
    </main>
  );
} 