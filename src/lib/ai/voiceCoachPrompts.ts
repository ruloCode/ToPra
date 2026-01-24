import { VoiceCoachData, TaskSummary } from '@/hooks/useVoiceCoachData';

/**
 * Build a context string for ElevenLabs Conversational AI.
 * This is sent via sendContextualUpdate() to provide dynamic context.
 * Optimized for token efficiency (~2500 max tokens).
 */
export function buildContextString(data: VoiceCoachData): string {
  // Timer status
  const timerStatus = data.timer.isRunning
    ? `ACTIVA: ${data.timer.remainingTime} restantes${data.timer.activeTaskName ? ` en "${data.timer.activeTaskName}"` : ''}`
    : 'Sin sesión activa';

  // Format tasks with short IDs for reference
  const formatTaskWithId = (t: TaskSummary) =>
    `[${t.shortId}] "${t.title}" (P${t.priority})`;

  // High priority tasks (max 5)
  const highPriorityList = data.tasks.highPriority.length > 0
    ? data.tasks.highPriority.slice(0, 5).map(formatTaskWithId).join('; ')
    : 'Ninguna';

  // Overdue tasks (max 3)
  const overdueList = data.tasks.overdue.length > 0
    ? data.tasks.overdue.slice(0, 3).map(t => `[${t.shortId}] "${t.title}"`).join('; ')
    : 'Ninguna';

  // Today's tasks (max 5)
  const todayList = data.tasks.todayDue.length > 0
    ? data.tasks.todayDue.slice(0, 5).map(formatTaskWithId).join('; ')
    : 'Ninguna';

  // Active task subtasks (max 5)
  const subtasksList = data.subtasks.activeTaskSubtasks.length > 0
    ? data.subtasks.activeTaskSubtasks.slice(0, 5).map(s =>
        `- ${s.status === 'completed' ? '✓' : '○'} "${s.title}"`
      ).join('\n')
    : 'Sin subtareas';

  // All pending tasks for reference (max 10)
  const allPendingList = data.tasks.allPending.length > 0
    ? data.tasks.allPending.slice(0, 10).map(t =>
        `[${t.shortId}] ${t.title}`
      ).join('; ')
    : 'Ninguna';

  // Today's sessions summary
  const sessionsToday = data.sessions.todaySessions.length > 0
    ? data.sessions.todaySessions.slice(0, 3).map(s =>
        `${s.duration}min${s.taskTitle ? ` (${s.taskTitle})` : ''}${s.rating ? ` ★${s.rating}` : ''}`
      ).join(', ')
    : 'Ninguna';

  // Progress indicator
  const progressBar = getProgressIndicator(data.stats.dailyProgressPercent);

  return `CONTEXTO ACTUAL DEL USUARIO:

## Estado
- Timer: ${timerStatus}
- Modo: ${data.timer.mode === 'timer' ? 'Temporizador' : 'Cronómetro'}

## Progreso Hoy
- Enfoque: ${data.stats.todayFocusMinutes}/${data.user.dailyGoalMinutes} min ${progressBar}
- Progreso: ${data.stats.dailyProgressPercent}%
- Tareas completadas hoy: ${data.stats.tasksCompletedToday}
- Racha actual: ${data.stats.currentStreak} días
- Sesiones hoy: ${sessionsToday}

## Tareas (Total: ${data.tasks.total} | Pendientes: ${data.tasks.pending + data.tasks.inProgress})
- Alta prioridad: ${highPriorityList}
- Vencidas: ${overdueList}
- Para hoy: ${todayList}

## Referencia de tareas pendientes (usa ID corto)
${allPendingList}

## Subtareas de tarea activa
${subtasksList}

## Estadísticas Semana
- Minutos esta semana: ${data.stats.weeklyFocusMinutes}
- vs semana anterior: ${data.stats.weekOverWeekChange >= 0 ? '+' : ''}${data.stats.weekOverWeekChange}%`;
}

/**
 * Generate a simple text progress indicator
 */
function getProgressIndicator(percent: number): string {
  const filled = Math.round(percent / 20); // 5 segments for 100%
  const empty = 5 - filled;
  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
}

function getDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = today.getTime() - due.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatOverdueTasks(tasks: TaskSummary[]): string {
  if (tasks.length === 0) return 'Ninguna';
  return tasks.map(t => {
    const days = t.dueDate ? getDaysOverdue(t.dueDate) : 0;
    return `- "${t.title}" - vencida hace ${days} día${days !== 1 ? 's' : ''}`;
  }).join('\n');
}

export function buildVoiceCoachSystemPrompt(context: VoiceCoachData): string {
  const timerStatus = context.timer.isRunning
    ? `Sesión activa: ${context.timer.remainingTime} restantes${context.timer.activeTaskName ? `, trabajando en "${context.timer.activeTaskName}"` : ''}`
    : 'Sin sesión activa';

  const pendingCount = context.tasks.pending + context.tasks.inProgress;

  // Format all pending tasks with short IDs for reference
  const pendingTasksWithIds = context.tasks.allPending.slice(0, 10)
    .map(t => `[${t.shortId}] ${t.title}`)
    .join('\n');

  // Format subtasks of active task
  const activeSubtasks = context.subtasks.activeTaskSubtasks.slice(0, 5)
    .map(s => `- ${s.status === 'completed' ? '✓' : '○'} ${s.title}`)
    .join('\n') || 'Sin subtareas';

  return `Eres el Coach de Productividad de ToPra, un asistente de voz amable, motivador y conciso.

## Tu Personalidad
- Hablas en español LATINOAMERICANO NEUTRO (sin regionalismos marcados)
- Tu voz es consistente: mismo tono, mismo acento, misma velocidad en cada respuesta
- Tono cálido, cercano y motivador
- Pronunciación clara y profesional, como un coach de productividad
- Eres MUY CONCISO - tus respuestas deben ser breves (1-3 oraciones cortas) porque serán habladas en voz alta
- Celebras los logros del usuario y ofreces ánimo cuando lo necesita
- Usas "tú" informal, nunca "usted"
- Nunca juzgas ni criticas, solo apoyas y guías
- Eres proactivo sugiriendo acciones basadas en el contexto

## Estado Actual del Usuario

### Timer y Sesión
${timerStatus}
- Modo: ${context.timer.mode === 'timer' ? 'Temporizador' : 'Cronómetro'}
- Duración seleccionada: ${context.timer.selectedDuration} minutos

### Progreso del Día
- Enfoque hoy: ${context.stats.todayFocusMinutes}/${context.user.dailyGoalMinutes} minutos (${context.stats.dailyProgressPercent}%)
- Tareas completadas hoy: ${context.stats.tasksCompletedToday}
- Racha actual: ${context.stats.currentStreak} días
- Esta semana: ${context.stats.weeklyFocusMinutes} minutos (${context.stats.weekOverWeekChange >= 0 ? '+' : ''}${context.stats.weekOverWeekChange}% vs anterior)

### Resumen de Tareas
- Total: ${context.tasks.total} tareas
- Pendientes: ${pendingCount} (${context.tasks.pending} sin empezar, ${context.tasks.inProgress} en progreso)
- Completadas: ${context.tasks.completed}

### Tareas de Alta Prioridad
${formatTaskListWithIds(context.tasks.highPriority)}

### Tareas con Fecha Hoy
${formatTaskListWithIds(context.tasks.todayDue)}

### Tareas Vencidas
${formatOverdueTasks(context.tasks.overdue)}

### Referencia de Tareas Pendientes (usa ID corto para acciones)
${pendingTasksWithIds || 'Ninguna'}

### Subtareas de Tarea Activa
${activeSubtasks}

## CAPACIDADES COMPLETAS

### 1. Control de Sesiones de Enfoque
- **start_focus_session**: Iniciar sesión → [ACTION:start_focus_session:DURACIÓN]
- **pause_timer**: Pausar sesión → [ACTION:pause_timer]
- **resume_timer**: Reanudar sesión → [ACTION:resume_timer]
- **complete_session**: Terminar sesión → [ACTION:complete_session]
- **rate_session**: Calificar sesión (1-5) → [ACTION:rate_session:RATING]
- **add_session_note**: Agregar nota → [ACTION:add_session_note:TEXTO]

### 2. Gestión de Tareas (CRUD Completo)
- **create_task**: Crear tarea → [ACTION:create_task:título]
  - Formato: título (obligatorio) | prioridad (opcional, default=2) | descripción (opcional)
  - Ejemplos válidos:
    - [ACTION:create_task:Comprar leche]
    - [ACTION:create_task:Llamar al doctor|3]
    - [ACTION:create_task:Preparar presentación|4|Para la reunión del lunes]
- **complete_task**: Completar tarea → [ACTION:complete_task:ID_O_TÍTULO]
- **edit_task**: Editar tarea → [ACTION:edit_task:ID|campo|valor]
  - Campos: title, priority (1-4), description, due_date, status
- **delete_task**: Eliminar tarea → [ACTION:delete_task:ID|confirmar]
  - ⚠️ SIEMPRE pide confirmación antes de eliminar
- **search_task**: Buscar tareas → [ACTION:search_task:QUERY]
- **get_task_details**: Ver detalles → [ACTION:get_task_details:ID]

### 3. Gestión de Subtareas
- **create_subtask**: Crear subtarea → [ACTION:create_subtask:taskId|título|prioridad]
  - Usa "currentTaskId" para la tarea activa
- **complete_subtask**: Completar subtarea → [ACTION:complete_subtask:ID_O_TÍTULO]
- **delete_subtask**: Eliminar subtarea → [ACTION:delete_subtask:ID_O_TÍTULO]

## Reglas de Respuesta
1. SIEMPRE responde en español
2. Mantén respuestas MUY CORTAS (1-3 oraciones, serán habladas por TTS)
3. Cuando ejecutes una acción, confirma brevemente lo que hiciste
4. Para eliminar, SIEMPRE pide confirmación primero
5. Usa el ID corto de 8 caracteres para referir tareas
6. Nunca inventes datos - usa SOLO el contexto proporcionado
7. Si el usuario pregunta estadísticas, usa los datos reales del contexto

## Ejemplos de Interacción

Usuario: "¿Cómo voy hoy?"
Respuesta: "Llevas ${context.stats.todayFocusMinutes} de ${context.user.dailyGoalMinutes} minutos, ${context.stats.dailyProgressPercent}% de tu meta. ${context.stats.tasksCompletedToday > 0 ? `${context.stats.tasksCompletedToday} tareas completadas. ` : ''}${context.stats.currentStreak > 0 ? `¡Racha de ${context.stats.currentStreak} días!` : '¡Empecemos tu racha!'}"

Usuario: "Cambia la prioridad de revisar documentos a urgente"
Respuesta: "Listo, prioridad actualizada a urgente." [ACTION:edit_task:ID_TAREA|priority|4]

Usuario: "Elimina la tarea de comprar café"
Respuesta: "¿Seguro que quieres eliminar 'Comprar café'? Dime 'sí' para confirmar."
Usuario: "Sí"
Respuesta: "Eliminada." [ACTION:delete_task:ID_TAREA|confirmar]

Usuario: "Agrega una subtarea para revisar sección 1"
Respuesta: "Subtarea agregada a tu tarea actual." [ACTION:create_subtask:currentTaskId|Revisar sección 1|2]

Usuario: "Califico esta sesión con 4"
Respuesta: "Sesión calificada con 4 estrellas. ¡Buen trabajo!" [ACTION:rate_session:4]

Usuario: "Inicia 25 minutos"
Respuesta: "¡Arrancamos! 25 minutos de enfoque. ¡Tú puedes!" [ACTION:start_focus_session:25]

Usuario: "¿Qué tareas tengo vencidas?"
Respuesta: "${context.tasks.overdue.length > 0 ? `Tienes ${context.tasks.overdue.length} vencidas: ${context.tasks.overdue.map(t => t.title).join(', ')}. ¿Empezamos con alguna?` : '¡Ninguna vencida! Estás al día.'}"`;
}

function formatTaskListWithIds(tasks: TaskSummary[]): string {
  if (tasks.length === 0) return 'Ninguna';
  return tasks.map(t => `- [${t.shortId}] "${t.title}" (P${t.priority})`).join('\n');
}

export const VOICE_COACH_TOOLS = [
  // ========== TIMER/SESSION TOOLS ==========
  {
    type: 'function' as const,
    function: {
      name: 'start_focus_session',
      description: 'Inicia una nueva sesión de enfoque/pomodoro con duración especificada',
      parameters: {
        type: 'object',
        properties: {
          duration: {
            type: 'number',
            description: 'Duración de la sesión en minutos (por defecto 25)',
          },
          taskId: {
            type: 'string',
            description: 'ID de la tarea a vincular (opcional)',
          },
        },
        required: ['duration'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'pause_timer',
      description: 'Pausa la sesión de enfoque actual',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'resume_timer',
      description: 'Reanuda la sesión de enfoque pausada',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'complete_session',
      description: 'Completa/termina la sesión de enfoque actual',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'rate_session',
      description: 'Califica la sesión de enfoque actual o la más reciente (1-5 estrellas)',
      parameters: {
        type: 'object',
        properties: {
          rating: {
            type: 'number',
            description: 'Calificación de 1 a 5',
          },
        },
        required: ['rating'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'add_session_note',
      description: 'Agrega una nota a la sesión de enfoque actual o la más reciente',
      parameters: {
        type: 'object',
        properties: {
          note: {
            type: 'string',
            description: 'Texto de la nota',
          },
        },
        required: ['note'],
      },
    },
  },

  // ========== TASK CRUD TOOLS ==========
  {
    type: 'function' as const,
    function: {
      name: 'create_task',
      description: 'Crea una nueva tarea para el usuario',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Título de la tarea (obligatorio)',
          },
          priority: {
            type: 'number',
            description: 'Prioridad: 1=baja, 2=media, 3=alta, 4=urgente (por defecto 2)',
          },
          description: {
            type: 'string',
            description: 'Descripción opcional de la tarea',
          },
        },
        required: ['title'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'complete_task',
      description: 'Marca una tarea como completada',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'ID corto o título de la tarea',
          },
        },
        required: ['taskId'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'edit_task',
      description: 'Edita una tarea existente (título, prioridad, descripción, fecha, estado)',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'ID corto o título de la tarea',
          },
          field: {
            type: 'string',
            description: 'Campo a editar: title, priority, description, due_date, status',
          },
          value: {
            type: 'string',
            description: 'Nuevo valor para el campo',
          },
        },
        required: ['taskId', 'field', 'value'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'delete_task',
      description: 'Elimina una tarea (requiere confirmación del usuario)',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'ID corto o título de la tarea',
          },
          confirmation: {
            type: 'string',
            description: 'Debe ser "confirmar" para ejecutar',
          },
        },
        required: ['taskId', 'confirmation'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'search_task',
      description: 'Busca tareas por texto',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Texto a buscar en títulos de tareas',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_task_details',
      description: 'Obtiene detalles completos de una tarea',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'ID corto o título de la tarea',
          },
        },
        required: ['taskId'],
      },
    },
  },

  // ========== SUBTASK TOOLS ==========
  {
    type: 'function' as const,
    function: {
      name: 'create_subtask',
      description: 'Crea una subtarea en la tarea activa o especificada',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'ID de la tarea padre (usa "currentTaskId" para la tarea activa)',
          },
          title: {
            type: 'string',
            description: 'Título de la subtarea',
          },
          priority: {
            type: 'number',
            description: 'Prioridad: 1=baja, 2=media, 3=alta, 4=urgente (por defecto 2)',
          },
        },
        required: ['title'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'complete_subtask',
      description: 'Marca una subtarea como completada',
      parameters: {
        type: 'object',
        properties: {
          subtaskId: {
            type: 'string',
            description: 'ID o título de la subtarea',
          },
        },
        required: ['subtaskId'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'delete_subtask',
      description: 'Elimina una subtarea',
      parameters: {
        type: 'object',
        properties: {
          subtaskId: {
            type: 'string',
            description: 'ID o título de la subtarea',
          },
        },
        required: ['subtaskId'],
      },
    },
  },
];
