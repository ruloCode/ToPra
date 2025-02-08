'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getFocusSessions, type FocusSession } from '@/lib/focus';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/components/AuthProvider';

export function FocusHistory() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getFocusSessions({ userId: user.id })
        .then(setSessions)
        .catch(console.error);
    }
  }, [user]);

  if (!sessions.length) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No hay sesiones de enfoque registradas aún.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Historial de Sesiones</h2>
      <div className="grid gap-4">
        {sessions.map((session) => (
          <Card key={session.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {session.task_id ? 'Tarea asociada' : 'Sesión sin tarea'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(session.start_time), 'PPp', { locale: es })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {session.duration
                    ? `${Math.floor(session.duration / 60)} minutos`
                    : 'En progreso'}
                </p>
                <p className={`text-sm ${getStatusColor(session.status)}`}>
                  {getStatusText(session.status)}
                </p>
              </div>
            </div>
            {session.notes && (
              <p className="mt-2 text-sm text-muted-foreground">{session.notes}</p>
            )}
            {session.rating && (
              <div className="mt-2 flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Valoración:</span>
                <span className="font-medium">{session.rating}/5</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'text-green-600';
    case 'interrupted':
      return 'text-red-600';
    default:
      return 'text-blue-600';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'completed':
      return 'Completada';
    case 'interrupted':
      return 'Interrumpida';
    case 'active':
      return 'En progreso';
    default:
      return status;
  }
} 