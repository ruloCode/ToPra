'use client';

import { useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import { 
  getFocusSessions, 
  deleteFocusSession,
  type FocusSession 
} from '@/lib/focus';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

// Extend FocusSession type to include task details
type FocusSessionWithTask = FocusSession & {
  task: {
    id: string;
    title: string;
    description: string | null;
  } | null;
};

export type FocusHistoryRef = {
  reloadSessions: () => Promise<void>;
};

export const FocusHistory = forwardRef<FocusHistoryRef>((props, ref) => {
  const [sessions, setSessions] = useState<FocusSessionWithTask[]>([]);
  const { user } = useAuth();
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Añadir estado para el tiempo de las sesiones activas
  const [activeDurations, setActiveDurations] = useState<Record<string, number>>({});

  const loadSessions = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const initialSessions = await getFocusSessions({ userId: user.id });
      setSessions(initialSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las sesiones.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Exponiendo la función de recarga a través del ref
  useImperativeHandle(ref, () => ({
    reloadSessions: loadSessions
  }), [loadSessions]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Actualizar el tiempo de las sesiones activas
  useEffect(() => {
    const activeSessionsInterval = setInterval(() => {
      const newDurations: Record<string, number> = {};
      sessions.forEach(session => {
        if (session.status === 'active') {
          const startTime = new Date(session.start_time).getTime();
          const elapsedMinutes = Math.floor((Date.now() - startTime) / (1000 * 60));
          newDurations[session.id] = elapsedMinutes;
        }
      });
      setActiveDurations(newDurations);
    }, 1000);

    return () => clearInterval(activeSessionsInterval);
  }, [sessions]);

  const handleDelete = async (sessionId: string) => {
    try {
      await deleteFocusSession(sessionId);
      await loadSessions(); // Recargar sesiones después de eliminar
      toast({
        title: "Sesión eliminada",
        description: "La sesión ha sido eliminada correctamente.",
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la sesión.",
        variant: "destructive",
      });
    }
    setSessionToDelete(null);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="loading loading-spinner loading-md mr-2" />
          Cargando sesiones...
        </div>
      </Card>
    );
  }

  if (!sessions.length) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No hay sesiones de enfoque registradas aún.
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Historial de Sesiones</h2>
        <div className="grid gap-2 sm:gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">
                    {session.task ? session.task.title : 'Sesión sin tarea'}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {format(new Date(session.start_time), 'PPp', { locale: es })}
                  </p>
                  {session.task?.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                      {session.task.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2">
                  <div className="text-right">
                    <p className="font-medium text-sm sm:text-base">
                      {session.status === 'active' 
                        ? formatDuration(activeDurations[session.id] || 0)
                        : formatDuration(session.duration)}
                    </p>
                    <p className={`text-xs sm:text-sm ${getStatusColor(session.status)}`}>
                      {getStatusText(session.status)}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-xs sm:text-sm px-2 py-1 h-auto"
                    onClick={() => setSessionToDelete(session.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
              {session.notes && (
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{session.notes}</p>
              )}
              {session.rating && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-xs sm:text-sm text-muted-foreground">Valoración:</span>
                  <span className="font-medium text-xs sm:text-sm">{session.rating}/5</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta sesión? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => sessionToDelete && handleDelete(sessionToDelete)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

FocusHistory.displayName = 'FocusHistory';

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

function formatDuration(minutes: number | null): string {
  if (!minutes) return 'En progreso';
  return `${minutes} minuto${minutes === 1 ? '' : 's'}`;
}