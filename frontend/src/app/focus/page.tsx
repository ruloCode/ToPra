'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { FocusMode } from '@/components/focus/FocusMode';
import { FocusHistory } from '@/components/focus/FocusHistory';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[1fr,400px]">
        <div className="order-2 md:order-1">
          <FocusHistory />
        </div>
        <div className="order-1 md:order-2">
          <FocusMode task={task || undefined} />
        </div>
      </div>
    </div>
  );
}

export default function FocusPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="text-foreground">Loading...</div>}>
        <FocusPageContent />
      </Suspense>
    </main>
  );
} 