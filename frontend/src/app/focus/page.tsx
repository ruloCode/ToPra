'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useRef } from 'react';
import { FocusMode } from '@/components/focus/FocusMode';
import { FocusHistory, type FocusHistoryRef } from '@/components/focus/FocusHistory';
import { getTaskById } from '@/lib/tasks';
import type { Task } from '@/lib/tasks';

function FocusPageContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams?.get('taskId') ?? null;
  const [task, setTask] = useState<Task | null>(null);
  // Corrigiendo el tipo de la referencia
  const historyRef = useRef<FocusHistoryRef>(null) as React.RefObject<FocusHistoryRef>;

  useEffect(() => {
    if (taskId) {
      getTaskById(taskId)
        .then(setTask)
        .catch(console.error);
    } else {
      setTask(null);
    }
  }, [taskId]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 lg:py-8 min-h-[calc(100vh-4rem)] mx-auto max-w-4xl">
      <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-[1fr,minmax(auto,500px)]">
          <div className="order-2 lg:order-1">
            <FocusHistory ref={historyRef} />
          </div>
          <div className="order-1 lg:order-2">
            <FocusMode
              task={task || undefined}
              historyRef={historyRef}
            />
          </div>
      </div>
    </div>
  );
}

export default function FocusPage() {
  return (
    <main className="main-content min-h-screen bg-background px-4 py-6 md:px-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-foreground">Cargando...</div>
        </div>
      }>
        <FocusPageContent />
      </Suspense>
    </main>
  );
}