# ElevenLabs Agents para ToPra Coach

Documentación completa de las capacidades, configuraciones y flujos de ElevenLabs Agents para mejorar el ToPra Coach.

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Configuración Actual del ToPra Coach v3](#2-configuración-actual-del-topra-coach-v3)
3. [Configuración Avanzada](#3-configuración-avanzada)
4. [Tipos de Herramientas (Tools)](#4-tipos-de-herramientas-tools)
5. [React SDK](#5-react-sdk-elevenlabsreact)
6. [Widget de Integración](#6-widget-de-integración)
7. [Seguridad](#7-seguridad)
8. [Workflows](#8-workflows-flujos-de-trabajo)
9. [Knowledge Base](#9-knowledge-base-rag)
10. [Monitoreo y Analytics](#10-monitoreo-y-analytics)
11. [Implementación Actual en ToPra](#11-implementación-actual-en-topra)
12. [Oportunidades de Mejora](#12-oportunidades-de-mejora)
13. [Referencias y Links](#13-referencias-y-links)

---

## 1. Resumen Ejecutivo

### ¿Qué es ElevenLabs Agents Platform?

ElevenLabs Agents Platform es una infraestructura conversacional end-to-end que permite crear agentes de voz inteligentes con capacidades avanzadas de:

- **ASR (Automatic Speech Recognition)**: Transcripción de voz a texto en tiempo real
- **LLM (Large Language Model)**: Procesamiento de lenguaje natural para comprensión y generación
- **TTS (Text-to-Speech)**: Síntesis de voz con voces naturales y expresivas
- **Turn-taking**: Gestión inteligente de turnos conversacionales

### Arquitectura del Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ElevenLabs Agents Pipeline                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Usuario          ASR              LLM              TTS          App   │
│   (Audio) ───►  (Whisper)  ───►  (GPT-4o)  ───►  (Fernanda)  ───► (UI) │
│                                                                         │
│                        ▲              │                                 │
│                        │              ▼                                 │
│                   Turn-taking    Tool Calls                             │
│                   Detection      (Actions)                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Capacidades Principales

| Capacidad | Descripción |
|-----------|-------------|
| **Conversaciones en tiempo real** | Latencia <500ms entre turnos |
| **Multiidioma** | Soporte para 29+ idiomas |
| **Tools/Functions** | Ejecutar acciones en respuesta a comandos de voz |
| **Contextual Updates** | Actualizar contexto dinámicamente durante la conversación |
| **Knowledge Base** | RAG integrado para documentos y bases de conocimiento |
| **Workflows** | Flujos complejos con múltiples nodos y condiciones |

---

## 2. Configuración Actual del ToPra Coach v3

### Información del Agente

| Parámetro | Valor |
|-----------|-------|
| **Agent ID** | `agent_3201kfryyfvkeckr5tywfm59dshq` |
| **Nombre** | ToPra Coach v3 |
| **Voz** | Fernanda Sanmiguel (Spanish Audiobook Neutral) |
| **LLM** | GPT-4o |
| **Idioma por defecto** | Español (es) |

### System Prompt Actual

El system prompt define la personalidad y capacidades del coach:

```markdown
Eres el Coach de Productividad de ToPra, un asistente de voz amable, motivador y conciso.

## Tu Personalidad
- Hablas en español LATINOAMERICANO NEUTRO (sin regionalismos marcados)
- Tu voz es consistente: mismo tono, mismo acento, misma velocidad
- Tono cálido, cercano y motivador
- Eres MUY CONCISO - respuestas de 1-3 oraciones cortas
- Celebras los logros del usuario
- Usas "tú" informal, nunca "usted"
- Nunca juzgas ni criticas, solo apoyas y guías
```

### Primer Mensaje (First Message)

```
¡Hola! Soy tu coach de productividad. ¿En qué puedo ayudarte hoy?
```

### Acciones Disponibles (18 Tools)

El coach puede ejecutar las siguientes acciones mediante marcadores `[ACTION:nombre:params]`:

#### Timer/Sesiones (6)
| Acción | Formato | Descripción |
|--------|---------|-------------|
| `start_focus_session` | `[ACTION:start_focus_session:25]` | Iniciar sesión de enfoque |
| `pause_timer` | `[ACTION:pause_timer]` | Pausar la sesión actual |
| `resume_timer` | `[ACTION:resume_timer]` | Reanudar sesión pausada |
| `complete_session` | `[ACTION:complete_session]` | Terminar la sesión |
| `rate_session` | `[ACTION:rate_session:4]` | Calificar sesión (1-5) |
| `add_session_note` | `[ACTION:add_session_note:texto]` | Agregar nota a la sesión |

#### Tareas CRUD (6)
| Acción | Formato | Descripción |
|--------|---------|-------------|
| `create_task` | `[ACTION:create_task:título\|prioridad\|descripción]` | Crear tarea |
| `complete_task` | `[ACTION:complete_task:id_o_titulo]` | Marcar completada |
| `edit_task` | `[ACTION:edit_task:id\|campo\|valor]` | Editar tarea |
| `delete_task` | `[ACTION:delete_task:id\|confirmar]` | Eliminar tarea |
| `search_task` | `[ACTION:search_task:query]` | Buscar tareas |
| `get_task_details` | `[ACTION:get_task_details:id]` | Ver detalles |

#### Subtareas (3)
| Acción | Formato | Descripción |
|--------|---------|-------------|
| `create_subtask` | `[ACTION:create_subtask:taskId\|titulo\|prioridad]` | Crear subtarea |
| `complete_subtask` | `[ACTION:complete_subtask:id_o_titulo]` | Completar subtarea |
| `delete_subtask` | `[ACTION:delete_subtask:id_o_titulo]` | Eliminar subtarea |

---

## 3. Configuración Avanzada

### Audio Settings

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| **ASR Format** | PCM 16000 Hz | Formato de audio para reconocimiento |
| **TTS Model** | eleven_flash_v2_5 | Modelo rápido para baja latencia |
| **Sample Rate** | 44100 Hz | Tasa de muestreo de salida |

### Turn-taking Settings

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| **Disposición** | Eager (Dispuesto) | Responde rápidamente |
| **Silence Timeout** | 7 segundos | Tiempo de silencio para finalizar turno |
| **Max Duration** | 300 segundos (5 min) | Duración máxima de sesión |

### Client Events

Eventos disponibles para el cliente:

```typescript
type ClientEvent =
  | 'audio'                    // Audio de respuesta
  | 'interruption'             // Usuario interrumpió
  | 'user_transcript'          // Transcripción del usuario
  | 'agent_response'           // Respuesta del agente
  | 'agent_response_correction' // Corrección de respuesta
  | 'ping'                     // Keep-alive
  | 'pong';                    // Keep-alive response
```

---

## 4. Tipos de Herramientas (Tools)

ElevenLabs Agents soporta 4 tipos de herramientas:

### 4.1 Client Tools

Ejecutadas directamente en el cliente (navegador). Ideales para:
- Manipulación de UI/DOM
- Navegación en la aplicación
- Acciones locales sin latencia de red

```typescript
// Ejemplo de Client Tool
const clientTools = {
  navigate_to_focus: {
    description: "Navega a la página de enfoque",
    parameters: {},
    handler: async () => {
      router.push('/focus');
      return { success: true };
    }
  }
};
```

### 4.2 Server Tools

Ejecutadas vía API en tu servidor. Para:
- Operaciones de base de datos
- Integraciones con APIs externas
- Operaciones que requieren autenticación

```typescript
// Configuración en dashboard
{
  "name": "create_task",
  "description": "Creates a new task in the database",
  "url": "https://api.yourapp.com/tasks",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer ${SUPABASE_SERVICE_KEY}"
  }
}
```

### 4.3 MCP Tools (Model Context Protocol)

Conexión a servidores MCP para:
- Integraciones con calendarios (Google Calendar, Outlook)
- Servicios de terceros
- Sistemas empresariales

### 4.4 System Tools (Built-in)

Herramientas del sistema:
| Tool | Descripción |
|------|-------------|
| `end_conversation` | Termina la conversación |
| `detect_language` | Detecta el idioma del usuario |
| `transfer_call` | Transfiere a otro agente/número |
| `send_sms` | Envía SMS al usuario |

---

## 5. React SDK (`@elevenlabs/react`)

### Instalación

```bash
npm install @elevenlabs/react
```

### Hook Principal: `useConversation()`

```typescript
import { useConversation } from '@elevenlabs/react';

const conversation = useConversation({
  // Callbacks
  onConnect: () => console.log('Connected'),
  onDisconnect: () => console.log('Disconnected'),
  onMessage: (message) => console.log('Message:', message),
  onError: (error) => console.error('Error:', error),
  onModeChange: (mode) => console.log('Mode:', mode.mode), // 'listening' | 'speaking'
  onStatusChange: (status) => console.log('Status:', status),
  onUnhandledClientToolCall: (tool) => console.log('Unhandled tool:', tool),
});
```

### Métodos Disponibles

#### Sesión
```typescript
// Iniciar sesión
await conversation.startSession({
  agentId: 'agent_xxx',
  connectionType: 'websocket', // o 'turn'
});

// Terminar sesión
await conversation.endSession();
```

#### Mensajes y Contexto
```typescript
// Enviar mensaje de texto (modo text-only)
conversation.sendUserMessage('Hola, ¿cómo estás?');

// Actualizar contexto dinámicamente
conversation.sendContextualUpdate(`
  Estado actual:
  - Timer: 15:00 restantes
  - Tarea activa: "Revisar documentos"
`);

// Indicar actividad del usuario
conversation.sendUserActivity('typing');
```

#### Audio
```typescript
// Ajustar volumen (0-1)
conversation.setVolume({ volume: 0.8 });

// Cambiar dispositivos
await conversation.changeInputDevice(deviceId);
await conversation.changeOutputDevice(deviceId);
```

#### Feedback
```typescript
// Enviar feedback sobre la conversación
conversation.sendFeedback({
  rating: 5,
  comment: 'Excelente experiencia'
});
```

### Configuración de Overrides

```typescript
await conversation.startSession({
  agentId: 'agent_xxx',
  overrides: {
    prompt: {
      prompt: 'System prompt personalizado...'
    },
    firstMessage: '¡Hola! ¿Listo para ser productivo?',
    language: 'es',
    voice: {
      voiceId: 'voice_xxx'
    },
    textOnly: false // Solo texto sin audio
  },
  serverLocation: 'us', // o 'eu', 'asia'
  micMuted: false,
  volume: 1.0
});
```

---

## 6. Widget de Integración

### Código Embed

```html
<elevenlabs-convai agent-id="agent_3201kfryyfvkeckr5tywfm59dshq"></elevenlabs-convai>
<script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
```

### Opciones de Widget

| Opción | Tipo | Descripción |
|--------|------|-------------|
| `agent-id` | string | ID del agente (requerido) |
| `chat-mode` | boolean | Habilitar modo chat con texto |
| `show-transcription` | boolean | Mostrar transcripción en tiempo real |
| `allowed-languages` | string[] | Idiomas permitidos |

### Personalización de Avatar (Orb)

```javascript
// Configuración de colores del orb
const orbConfig = {
  colors: {
    idle: '#c5c77e',      // Inactivo
    listening: '#b5b76a', // Escuchando
    speaking: '#a5a75a',  // Hablando
    connecting: '#c0c27a' // Conectando
  },
  animation: {
    amplitude: 20,  // Amplitud de ondulación
    speed: 0.035    // Velocidad de animación
  }
};
```

### Estilos CSS

```css
elevenlabs-convai {
  --accent-color: #c5c77e;
  --background-color: #f9f9f7;
  --text-color: #4a4c3e;
  --border-radius: 16px;
}
```

---

## 7. Seguridad

### Autenticación de Usuarios

```typescript
// Signed URL para autenticación segura
const response = await fetch('/api/elevenlabs/signed-url', {
  method: 'POST',
  body: JSON.stringify({ userId: user.id })
});
const { signedUrl } = await response.json();

await conversation.startSession({
  agentId: 'agent_xxx',
  signedUrl
});
```

### Lista de Hosts Permitidos

Configurar en el dashboard:
```
Allowed Origins:
- https://topra.app
- https://*.topra.app
- http://localhost:3000 (desarrollo)
```

### Guardrails (Alpha)

Configuración de contenido permitido:
```json
{
  "guardrails": {
    "blockedTopics": ["política", "religión"],
    "maxResponseLength": 500,
    "requireConfirmation": ["delete_task", "delete_subtask"]
  }
}
```

### Overrides Permitidos al Cliente

```json
{
  "allowedOverrides": {
    "prompt": false,        // No permitir cambiar prompt
    "firstMessage": true,   // Permitir personalizar saludo
    "language": true,       // Permitir cambiar idioma
    "voice": false          // No permitir cambiar voz
  }
}
```

### Webhooks Post-Llamada

```typescript
// Webhook configurado en dashboard
POST https://api.topra.app/webhooks/elevenlabs
{
  "event": "conversation.ended",
  "conversation_id": "conv_xxx",
  "duration_seconds": 180,
  "messages_count": 12,
  "tools_called": ["create_task", "start_focus_session"]
}
```

### Límites

| Límite | Plan Free | Plan Pro |
|--------|-----------|----------|
| Daily calls | 100 | 10,000 |
| Concurrent calls | 2 | 20 |
| Max duration | 5 min | 60 min |
| Burst pricing | N/A | $0.08/min |

---

## 8. Workflows (Flujos de Trabajo)

### Visual Workflow Builder

ElevenLabs ofrece un constructor visual de workflows para flujos conversacionales complejos:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Inicio    │────►│   Saludo     │────►│  Pregunta   │
│             │     │  Bienvenida  │     │  Principal  │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                │
                    ┌───────────────────────────┼───────────────────────────┐
                    │                           │                           │
                    ▼                           ▼                           ▼
            ┌───────────────┐          ┌───────────────┐          ┌───────────────┐
            │  Crear Tarea  │          │ Iniciar Timer │          │   Consultar   │
            │               │          │               │          │   Progreso    │
            └───────────────┘          └───────────────┘          └───────────────┘
```

### Tipos de Nodos

| Nodo | Descripción |
|------|-------------|
| **Prompt** | Define comportamiento del agente |
| **Condition** | Bifurcación basada en condiciones |
| **Tool Call** | Ejecuta una herramienta |
| **Transfer** | Transfiere a otro agente |
| **End** | Finaliza el flujo |

### Prevención de Loops

El sistema detecta y previene loops infinitos automáticamente:
```json
{
  "maxIterations": 5,
  "loopDetection": true,
  "fallbackNode": "end_conversation"
}
```

---

## 9. Knowledge Base (RAG)

### Subir Documentos

Tipos de documentos soportados:
- PDF
- TXT
- DOCX
- MD (Markdown)
- HTML
- JSON

### Configuración de RAG

```json
{
  "knowledgeBase": {
    "enabled": true,
    "searchTopK": 5,          // Número de chunks a recuperar
    "similarityThreshold": 0.7,
    "chunkSize": 500,         // Tokens por chunk
    "chunkOverlap": 50        // Overlap entre chunks
  }
}
```

### Ejemplo de Uso

```typescript
// El agente automáticamente consulta la knowledge base
// cuando el usuario pregunta algo relevante

// Usuario: "¿Cuáles son las técnicas de productividad recomendadas?"
// Agente: [Consulta KB] → Responde con información de documentos
```

---

## 10. Monitoreo y Analytics

### Dashboard de Métricas

| Métrica | Descripción |
|---------|-------------|
| Total Conversations | Conversaciones totales |
| Avg Duration | Duración promedio |
| Success Rate | Tasa de éxito |
| Tool Usage | Uso de herramientas |
| User Satisfaction | Satisfacción del usuario |

### Conversation Analysis

```typescript
// Acceder a análisis de conversación
const analysis = await elevenlabs.conversations.analyze(conversationId);

console.log(analysis);
// {
//   sentiment: 'positive',
//   topics: ['productivity', 'tasks'],
//   toolsUsed: ['create_task', 'start_focus_session'],
//   duration: 180,
//   transcripts: [...]
// }
```

### Testing Automatizado

```typescript
// Test de regresión para el agente
const testCases = [
  {
    input: "Crea una tarea llamada revisar emails",
    expectedAction: "create_task",
    expectedParams: { title: "revisar emails" }
  },
  {
    input: "Inicia una sesión de 25 minutos",
    expectedAction: "start_focus_session",
    expectedParams: { duration: 25 }
  }
];

// Ejecutar tests
for (const test of testCases) {
  const result = await agent.test(test.input);
  assert(result.action === test.expectedAction);
}
```

### Versionado de Agentes

```bash
# Versiones del agente
v1.0.0 - Lanzamiento inicial
v2.0.0 - Agregado CRUD de tareas
v3.0.0 - Subtareas y estadísticas (actual)
```

---

## 11. Implementación Actual en ToPra

### Arquitectura de Integración

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ToPra Voice Coach                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐   │
│   │ VoiceCoachCtx   │◄──►│ useConversation │◄──►│ ElevenLabs API  │   │
│   │ (Provider)      │    │ (@elevenlabs)   │    │ (WebSocket)     │   │
│   └────────┬────────┘    └─────────────────┘    └─────────────────┘   │
│            │                                                            │
│            ▼                                                            │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐   │
│   │ useVoiceCoach   │    │ voiceCoachData  │    │ voiceCoachPrompt│   │
│   │ (Hook)          │    │ (Context Data)  │    │ (System Prompt) │   │
│   └─────────────────┘    └─────────────────┘    └─────────────────┘   │
│                                                                         │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐   │
│   │ VoiceCoach.tsx  │    │ VoiceButton.tsx │    │ VoiceBlob       │   │
│   │ (Main UI)       │    │ (Trigger)       │    │ (Animation)     │   │
│   └─────────────────┘    └─────────────────┘    └─────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Archivos Principales

| Archivo | Propósito |
|---------|-----------|
| `src/contexts/VoiceCoachContext.tsx` | Provider principal, maneja conexión ElevenLabs |
| `src/lib/ai/voiceCoachPrompts.ts` | System prompt, context builder, tools |
| `src/hooks/useVoiceCoachData.ts` | Datos de contexto (tareas, timer, stats) |
| `src/components/voice/VoiceCoach.tsx` | UI principal del coach (blob, transcripción) |
| `src/app/api/elevenlabs/tts/route.ts` | Endpoint TTS para síntesis de voz |
| `src/app/api/voice/chat/route.ts` | Endpoint chat con OpenAI (backup) |

### Flujo de Datos

```typescript
// 1. Usuario abre el coach
openCoach() → setIsOpen(true)

// 2. Se inicia la sesión ElevenLabs
startConversation() → conversation.startSession({ agentId })

// 3. Se envía contexto inicial
sendContextualUpdate(buildContextString(voiceCoachData))

// 4. Usuario habla
onMessage({ source: 'user', message: 'texto...' })

// 5. Agente responde con posibles acciones
onMessage({ source: 'ai', message: 'Texto [ACTION:create_task:titulo]' })

// 6. Se parsean y ejecutan acciones
parseActions(message) → executeAction({ name: 'create_task', params: 'titulo' })

// 7. Se actualiza el contexto
refreshTasks() → forceContextUpdate()
```

### Variables de Entorno

```bash
# .env.local
ELEVENLABS_API_KEY=sk_xxxxx           # API Key para TTS
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_3201kfryyfvkeckr5tywfm59dshq
ELEVENLABS_VOICE_ID=cgSgspJ2msm6clMCkdW9  # Fernanda (opcional)
```

### Manejo de Acciones

Las acciones se ejecutan parseando marcadores `[ACTION:nombre:params]`:

```typescript
function parseActions(text: string) {
  const actionRegex = /\[ACTION:(\w+)(?::([^\]]+))?\]/g;
  const actions = [];
  let match;

  while ((match = actionRegex.exec(text)) !== null) {
    actions.push({
      name: match[1],
      params: match[2] || '',
    });
  }

  const cleanText = text.replace(actionRegex, '').trim();
  return { cleanText, actions };
}
```

---

## 12. Oportunidades de Mejora

### Implementaciones Recomendadas

- [ ] **Client Tools Nativos**: Migrar de `[ACTION:...]` a Client Tools de ElevenLabs
  - Ventaja: Ejecución directa sin parseo
  - Implementación: Definir handlers en `clientTools` config

- [ ] **Knowledge Base de Productividad**: Agregar documentos de productividad
  - Técnicas Pomodoro
  - GTD (Getting Things Done)
  - Time blocking
  - Deep work principles

- [ ] **MCP Servers para Calendarios**: Integrar Google Calendar / Outlook
  - "¿Qué reuniones tengo hoy?"
  - "Bloquea 2 horas para trabajo profundo"

- [ ] **Workflows Complejos**: Implementar flujos guiados
  - Onboarding de nuevos usuarios
  - Review semanal guiado
  - Planificación del día

- [ ] **Testing Automatizado**: Suite de pruebas de regresión
  - Tests para cada acción
  - Tests de comprensión de contexto
  - Tests de manejo de errores

- [ ] **Webhooks Post-Llamada**: Analytics avanzados
  - Tracking de sesiones de coaching
  - Análisis de patrones de uso
  - Métricas de efectividad

- [ ] **Guardrails de Seguridad**: Configurar límites
  - Confirmación obligatoria para eliminaciones
  - Límites de acciones por sesión
  - Filtrado de contenido inapropiado

### Ejemplo: Migración a Client Tools

```typescript
// Actual (parsing manual)
onMessage: (message) => {
  const { cleanText, actions } = parseActions(message.message);
  for (const action of actions) {
    executeAction(action);
  }
}

// Propuesto (Client Tools nativos)
const conversation = useConversation({
  clientTools: {
    start_focus_session: {
      description: "Inicia una sesión de enfoque",
      parameters: {
        type: "object",
        properties: {
          duration: { type: "number", description: "Duración en minutos" }
        }
      },
      handler: async ({ duration }) => {
        await startSession({ duration: duration || 25 });
        return { success: true, message: "Sesión iniciada" };
      }
    },
    create_task: {
      description: "Crea una nueva tarea",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          priority: { type: "number" }
        },
        required: ["title"]
      },
      handler: async ({ title, priority }) => {
        await createTask({ title, priority: priority || 2 });
        return { success: true, taskTitle: title };
      }
    }
  }
});
```

---

## 13. Referencias y Links

### Documentación Oficial

- [ElevenLabs Agents Overview](https://elevenlabs.io/docs/conversational-ai/overview)
- [React SDK Documentation](https://elevenlabs.io/docs/conversational-ai/clients/react)
- [API Reference](https://elevenlabs.io/docs/api-reference/conversational-ai)
- [Tools & Function Calling](https://elevenlabs.io/docs/conversational-ai/customization/tools)
- [Knowledge Base (RAG)](https://elevenlabs.io/docs/conversational-ai/customization/knowledge-base)
- [Workflows](https://elevenlabs.io/docs/conversational-ai/workflows)

### SDK Repositories

- [GitHub: @elevenlabs/react](https://github.com/elevenlabs/elevenlabs-js)
- [npm: @elevenlabs/react](https://www.npmjs.com/package/@elevenlabs/react)

### Guías y Tutoriales

- [Building Voice Agents with React](https://elevenlabs.io/docs/conversational-ai/guides/react-quickstart)
- [Implementing Client Tools](https://elevenlabs.io/docs/conversational-ai/customization/tools/client-tools)
- [Securing Your Agent](https://elevenlabs.io/docs/conversational-ai/security)

### Recursos Adicionales

- [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai)
- [Voice Library](https://elevenlabs.io/voice-library)
- [Status Page](https://status.elevenlabs.io/)

---

## Changelog

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2025-01-24 | 1.0.0 | Documentación inicial |

---

*Última actualización: Enero 2025*
