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
  const formatTaskWithId = (t: TaskSummary) => {
    const tagsStr = t.tags && t.tags.length > 0 ? ` [${t.tags.join(', ')}]` : '';
    return `[${t.shortId}] "${t.title}" (P${t.priority})${tagsStr}`;
  };

  // Available user tags
  const availableTags = data.tags.available.length > 0
    ? data.tags.available.map(t => `${t.name} (${t.color})`).join(', ')
    : 'Sin tags';

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

## Tags Disponibles
${availableTags}

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

  // Format all pending tasks with short IDs for reference (include tags)
  const pendingTasksWithIds = context.tasks.allPending.slice(0, 10)
    .map(t => {
      const tagsStr = t.tags && t.tags.length > 0 ? ` [${t.tags.join(', ')}]` : '';
      return `[${t.shortId}] ${t.title}${tagsStr}`;
    })
    .join('\n');

  // Available user tags
  const availableTagsList = context.tags.available.length > 0
    ? context.tags.available.map(t => `- ${t.name} (${t.color})`).join('\n')
    : 'Sin tags creados';

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

### Tags Disponibles del Usuario
${availableTagsList}

## HERRAMIENTAS DISPONIBLES (Client Tools)

Tienes acceso a herramientas que se ejecutan SILENCIOSAMENTE en el cliente. Cuando uses una herramienta:
- La acción se ejecuta automáticamente sin que el usuario la escuche
- Tu respuesta verbal SOLO debe ser la confirmación natural, SIN marcadores de acción
- NUNCA incluyas [ACTION:...] en tu respuesta - eso se escucharía en voz alta

### 1. Control de Sesiones de Enfoque
- **start_focus_session**: Iniciar sesión (parámetro: duration en minutos)
- **pause_timer**: Pausar sesión
- **resume_timer**: Reanudar sesión
- **complete_session**: Terminar sesión
- **rate_session**: Calificar sesión (parámetro: rating 1-5)
- **add_session_note**: Agregar nota (parámetro: note)
- **change_session_task**: Cambiar tarea de sesión (parámetro: taskId)

### 2. Gestión de Tareas (CRUD Completo)
- **create_task**: Crear tarea (parámetros: title obligatorio, priority 1-4 opcional, description opcional)
- **complete_task**: Completar tarea (parámetro: taskId - nombre o ID)
- **set_task_status**: Cambiar estado (parámetros: taskId, status: pending/in_progress/completed)
- **edit_task**: Editar tarea (parámetros: taskId, field, value)
  - Campos: title, priority, description, due_date, status
- **delete_task**: Eliminar tarea (parámetros: taskId, confirmation="confirmar")
  - ⚠️ SIEMPRE pide confirmación verbal antes de llamar esta herramienta
- **search_task**: Buscar tareas (parámetro: query)
- **get_task_details**: Ver detalles (parámetro: taskId)

### 3. Gestión de Tags
- **add_tag_to_task**: Asignar tag (parámetros: taskId, tagName)
- **remove_tag_from_task**: Quitar tag (parámetros: taskId, tagName)
- **create_tag**: Crear nuevo tag (parámetros: name, color opcional)
  - Colores válidos: blue, yellow, green, red, purple, teal, orange, pink
- **list_tags**: Listar tags disponibles
- **delete_tag**: Eliminar tag (parámetros: tagName, confirmation="confirmar")

### 4. Sistema de Comentarios
- **add_comment**: Agregar comentario (parámetros: taskId o "currentTaskId", content)
- **list_comments**: Listar comentarios (parámetro: taskId o "currentTaskId")
- **delete_comment**: Eliminar comentario (parámetros: commentId, confirmation="confirmar")

### 5. Gestión de Subtareas
- **create_subtask**: Crear subtarea (parámetros: taskId o "currentTaskId", title, priority opcional)
- **complete_subtask**: Completar subtarea (parámetro: subtaskId - nombre o ID)
- **edit_subtask**: Editar subtarea (parámetros: subtaskId, field, value)
- **delete_subtask**: Eliminar subtarea (parámetro: subtaskId)

## Cómo Identificar Tareas

1. **Por nombre**: Usa el nombre/título que menciona el usuario
   - "Agrega el tag trabajo a revisar emails" → taskId: "revisar emails"

2. **Tarea actual**: Si hay sesión activa y dice "mi tarea actual" o "esta tarea"
   - taskId: "currentTaskId"

3. **ID corto**: Si tienes el shortId del contexto (8 caracteres), úsalo directamente

## Reglas de Respuesta CRÍTICAS
1. SIEMPRE responde en español
2. Mantén respuestas MUY CORTAS (1-3 oraciones, serán habladas por TTS)
3. **IMPORTANTE**: Tu respuesta verbal es SOLO lo que se escuchará. Las herramientas se ejecutan silenciosamente.
4. **NUNCA** incluyas [ACTION:...] en tu respuesta - eso causaría que se hable en voz alta
5. Para eliminar, SIEMPRE pide confirmación verbal primero, luego usa la herramienta con confirmation="confirmar"
6. Nunca inventes datos - usa SOLO el contexto proporcionado
7. Si el usuario pregunta estadísticas, usa los datos reales del contexto

## Ejemplos de Interacción (respuestas limpias, sin marcadores)

Usuario: "¿Cómo voy hoy?"
Respuesta: "Llevas ${context.stats.todayFocusMinutes} de ${context.user.dailyGoalMinutes} minutos, ${context.stats.dailyProgressPercent}% de tu meta. ${context.stats.tasksCompletedToday > 0 ? `${context.stats.tasksCompletedToday} tareas completadas. ` : ''}${context.stats.currentStreak > 0 ? `¡Racha de ${context.stats.currentStreak} días!` : '¡Empecemos tu racha!'}"
(No se usa herramienta, solo consulta de datos)

Usuario: "Cambia la prioridad de revisar documentos a urgente"
Herramienta: edit_task({ taskId: "revisar documentos", field: "priority", value: "4" })
Respuesta: "Listo, prioridad actualizada a urgente."

Usuario: "Elimina la tarea de comprar café"
Respuesta: "¿Seguro que quieres eliminar 'Comprar café'? Dime 'sí' para confirmar."
Usuario: "Sí"
Herramienta: delete_task({ taskId: "comprar café", confirmation: "confirmar" })
Respuesta: "Eliminada."

Usuario: "Agrega una subtarea para revisar sección 1"
Herramienta: create_subtask({ taskId: "currentTaskId", title: "Revisar sección 1", priority: 2 })
Respuesta: "Subtarea agregada a tu tarea actual."

Usuario: "Califico esta sesión con 4"
Herramienta: rate_session({ rating: 4 })
Respuesta: "Sesión calificada con 4 estrellas. ¡Buen trabajo!"

Usuario: "Inicia 25 minutos"
Herramienta: start_focus_session({ duration: 25 })
Respuesta: "¡Arrancamos! 25 minutos de enfoque. ¡Tú puedes!"

Usuario: "¿Qué tareas tengo vencidas?"
Respuesta: "${context.tasks.overdue.length > 0 ? `Tienes ${context.tasks.overdue.length} vencidas: ${context.tasks.overdue.map(t => t.title).join(', ')}. ¿Empezamos con alguna?` : '¡Ninguna vencida! Estás al día.'}"
(No se usa herramienta, solo consulta de datos)

Usuario: "Cambia el estado de revisar emails a en progreso"
Herramienta: set_task_status({ taskId: "revisar emails", status: "in_progress" })
Respuesta: "Listo, cambié el estado a en progreso."

Usuario: "Agrega el tag trabajo a mi tarea de revisar emails"
Herramienta: add_tag_to_task({ taskId: "revisar emails", tagName: "trabajo" })
Respuesta: "Tag agregado a la tarea."

Usuario: "Agrega el tag urgente a mi tarea actual" (hay timer activo)
Herramienta: add_tag_to_task({ taskId: "currentTaskId", tagName: "urgente" })
Respuesta: "Tag agregado."

Usuario: "Crea un tag llamado urgente con color rojo"
Herramienta: create_tag({ name: "urgente", color: "red" })
Respuesta: "Tag 'urgente' creado con color rojo."

Usuario: "¿Qué tags tengo disponibles?"
Herramienta: list_tags()
Respuesta: "Tienes estos tags: ${context.tags.available.length > 0 ? context.tags.available.map(t => t.name).join(', ') : 'ninguno creado aún'}."

Usuario: "Agrega un comentario a mi tarea: necesito revisar los anexos"
Herramienta: add_comment({ taskId: "currentTaskId", content: "necesito revisar los anexos" })
Respuesta: "Comentario agregado."

Usuario: "Quiero trabajar en otra tarea durante esta sesión"
Respuesta: "¿En cuál tarea quieres enfocarte?"
Usuario: "En preparar presentación"
Herramienta: change_session_task({ taskId: "preparar presentación" })
Respuesta: "Listo, cambié la sesión a trabajar en 'preparar presentación'."

Usuario: "Cambia la descripción de mi tarea actual a revisar todos los anexos"
Herramienta: edit_task({ taskId: "currentTaskId", field: "description", value: "revisar todos los anexos" })
Respuesta: "Descripción actualizada."

Usuario: "Quita el tag personal de comprar leche"
Herramienta: remove_tag_from_task({ taskId: "comprar leche", tagName: "personal" })
Respuesta: "Tag quitado."`;
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

  // ========== SESSION TASK CHANGE ==========
  {
    type: 'function' as const,
    function: {
      name: 'change_session_task',
      description: 'Cambia la tarea asociada a la sesión de enfoque activa',
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

  // ========== TASK STATUS ==========
  {
    type: 'function' as const,
    function: {
      name: 'set_task_status',
      description: 'Cambia el estado de una tarea (pending, in_progress, completed)',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'ID corto o título de la tarea',
          },
          status: {
            type: 'string',
            description: 'Nuevo estado: pending, in_progress, o completed',
          },
        },
        required: ['taskId', 'status'],
      },
    },
  },

  // ========== TAG TOOLS ==========
  {
    type: 'function' as const,
    function: {
      name: 'add_tag_to_task',
      description: 'Agrega un tag a una tarea',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'ID corto o título de la tarea',
          },
          tagName: {
            type: 'string',
            description: 'Nombre del tag a agregar',
          },
        },
        required: ['taskId', 'tagName'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'remove_tag_from_task',
      description: 'Quita un tag de una tarea',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'ID corto o título de la tarea',
          },
          tagName: {
            type: 'string',
            description: 'Nombre del tag a quitar',
          },
        },
        required: ['taskId', 'tagName'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'create_tag',
      description: 'Crea un nuevo tag para el usuario',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Nombre del tag',
          },
          color: {
            type: 'string',
            description: 'Color: blue, yellow, green, red, purple, teal, orange, pink',
          },
        },
        required: ['name'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'list_tags',
      description: 'Lista todos los tags disponibles del usuario',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'delete_tag',
      description: 'Elimina un tag del usuario (requiere confirmación)',
      parameters: {
        type: 'object',
        properties: {
          tagName: {
            type: 'string',
            description: 'Nombre del tag a eliminar',
          },
          confirmation: {
            type: 'string',
            description: 'Debe ser "confirmar" para ejecutar',
          },
        },
        required: ['tagName', 'confirmation'],
      },
    },
  },

  // ========== COMMENT TOOLS ==========
  {
    type: 'function' as const,
    function: {
      name: 'add_comment',
      description: 'Agrega un comentario a una tarea',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'ID de la tarea (usa "currentTaskId" para la tarea activa)',
          },
          content: {
            type: 'string',
            description: 'Texto del comentario',
          },
        },
        required: ['content'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'list_comments',
      description: 'Lista los comentarios de una tarea',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'ID de la tarea (usa "currentTaskId" para la tarea activa)',
          },
        },
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'delete_comment',
      description: 'Elimina un comentario (requiere confirmación)',
      parameters: {
        type: 'object',
        properties: {
          commentId: {
            type: 'string',
            description: 'ID del comentario a eliminar',
          },
          confirmation: {
            type: 'string',
            description: 'Debe ser "confirmar" para ejecutar',
          },
        },
        required: ['commentId', 'confirmation'],
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
      name: 'edit_subtask',
      description: 'Edita una subtarea (título, prioridad o estado)',
      parameters: {
        type: 'object',
        properties: {
          subtaskId: {
            type: 'string',
            description: 'ID o título de la subtarea',
          },
          field: {
            type: 'string',
            description: 'Campo a editar: title, priority, status',
          },
          value: {
            type: 'string',
            description: 'Nuevo valor',
          },
        },
        required: ['subtaskId', 'field', 'value'],
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
