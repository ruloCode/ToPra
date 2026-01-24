'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { X, Mic, MicOff, Phone, Loader2, Check, Timer, ListTodo, Sparkles } from 'lucide-react';
import { useVoiceCoach, VoiceMessage } from '@/contexts/VoiceCoachContext';
import { useVoiceCoachData } from '@/hooks/useVoiceCoachData';

// ============================================================================
// ORGANIC BLOB VISUALIZATION
// ============================================================================

function VoiceBlob({ status }: { status: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const targetParamsRef = useRef({ amplitude: 8, speed: 0.015, pulseSpeed: 0.02 });
  const currentParamsRef = useRef({ amplitude: 8, speed: 0.015, pulseSpeed: 0.02 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(window.innerWidth * 0.38, 260);
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = canvas.width * 0.34;

    const getTargetParams = () => {
      switch (status) {
        case 'listening':
          return { amplitude: 22, speed: 0.035, pulseSpeed: 0.07, color: '#b5b76a' };
        case 'speaking':
          return { amplitude: 32, speed: 0.055, pulseSpeed: 0.11, color: '#a5a75a' };
        case 'connecting':
          return { amplitude: 12, speed: 0.025, pulseSpeed: 0.12, color: '#c0c27a' };
        default:
          return { amplitude: 6, speed: 0.012, pulseSpeed: 0.015, color: '#c5c77e' };
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      const target = getTargetParams();
      targetParamsRef.current = target;

      // Smooth interpolation for organic feel
      currentParamsRef.current.amplitude = lerp(currentParamsRef.current.amplitude, target.amplitude, 0.08);
      currentParamsRef.current.speed = lerp(currentParamsRef.current.speed, target.speed, 0.08);
      currentParamsRef.current.pulseSpeed = lerp(currentParamsRef.current.pulseSpeed, target.pulseSpeed, 0.08);

      const params = currentParamsRef.current;
      timeRef.current += params.speed;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Outer glow layer
      ctx.beginPath();
      const glowPoints = 100;
      for (let i = 0; i <= glowPoints; i++) {
        const angle = (i / glowPoints) * Math.PI * 2;
        const noise1 = Math.sin(angle * 3 + timeRef.current * 1.5) * (params.amplitude * 1.3);
        const noise2 = Math.sin(angle * 5 - timeRef.current) * (params.amplitude * 0.6);
        const r = baseRadius * 1.08 + noise1 + noise2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = `${target.color}22`;
      ctx.fill();

      // Main blob
      ctx.beginPath();
      const points = 120;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const noise1 = Math.sin(angle * 3 + timeRef.current * 2) * params.amplitude;
        const noise2 = Math.sin(angle * 5 - timeRef.current * 1.5) * (params.amplitude * 0.5);
        const noise3 = Math.sin(angle * 7 + timeRef.current * 3) * (params.amplitude * 0.3);
        const pulse = Math.sin(timeRef.current * params.pulseSpeed * 10) * (params.amplitude * 0.35);
        const r = baseRadius + noise1 + noise2 + noise3 + pulse;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const gradient = ctx.createRadialGradient(
        centerX - baseRadius * 0.25,
        centerY - baseRadius * 0.25,
        0,
        centerX,
        centerY,
        baseRadius * 1.15
      );
      gradient.addColorStop(0, adjustColor(target.color, 12));
      gradient.addColorStop(0.5, target.color);
      gradient.addColorStop(1, adjustColor(target.color, -18));
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.arc(centerX - baseRadius * 0.2, centerY - baseRadius * 0.2, baseRadius * 0.15, 0, Math.PI * 2);
      const highlightGradient = ctx.createRadialGradient(
        centerX - baseRadius * 0.2,
        centerY - baseRadius * 0.2,
        0,
        centerX - baseRadius * 0.2,
        centerY - baseRadius * 0.2,
        baseRadius * 0.15
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = highlightGradient;
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [status]);

  return (
    <canvas
      ref={canvasRef}
      className="transition-transform duration-1000 ease-out"
      style={{
        transform: status === 'listening' ? 'scale(1.03)' : status === 'speaking' ? 'scale(1.06)' : 'scale(1)',
      }}
    />
  );
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

// ============================================================================
// TRANSCRIPTION PANEL
// ============================================================================

function TranscriptionPanel({ messages }: { messages: VoiceMessage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayMessages = useMemo(() => messages.slice(-6), [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages]);

  if (displayMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#a5a595] text-sm italic font-light tracking-wide">
          Di algo para empezar...
        </p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto space-y-3 px-1 scrollbar-thin">
      {displayMessages.map((message, index) => (
        <div
          key={message.id}
          className="animate-transcript-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-[#e8e8e0] text-[#4a4a3a] rounded-br-sm'
                  : 'bg-[#d8daa0] text-[#3a3c2e] rounded-bl-sm'
              }`}
            >
              <p className="text-sm leading-relaxed font-normal">{message.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// ACTION TOAST
// ============================================================================

interface ActionToast {
  id: string;
  type: 'task' | 'timer' | 'success';
  message: string;
}

function ActionToasts({ toasts }: { toasts: ActionToast[] }) {
  return (
    <div className="fixed top-20 right-4 md:right-8 z-[210] space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast-in pointer-events-auto"
        >
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md"
            style={{
              background: 'rgba(255, 255, 253, 0.92)',
              border: '1px solid rgba(197, 199, 126, 0.3)',
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(197, 199, 126, 0.2)' }}
            >
              {toast.type === 'timer' && <Timer className="w-4 h-4 text-[#7a7c4e]" />}
              {toast.type === 'task' && <ListTodo className="w-4 h-4 text-[#7a7c4e]" />}
              {toast.type === 'success' && <Check className="w-4 h-4 text-[#7a7c4e]" />}
            </div>
            <span className="text-sm font-medium text-[#4a4a3a]">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// CONTEXT INDICATOR
// ============================================================================

function ContextIndicator() {
  const voiceData = useVoiceCoachData();

  const activeTask = voiceData.timer.activeTaskName;
  const progress = voiceData.stats.dailyProgressPercent;
  const focusMinutes = voiceData.stats.todayFocusMinutes;

  return (
    <div
      className="flex items-center gap-4 px-5 py-3 rounded-2xl"
      style={{
        background: 'rgba(255, 255, 253, 0.7)',
        border: '1px solid rgba(197, 199, 126, 0.2)',
      }}
    >
      {activeTask ? (
        <>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#c5c77e] animate-pulse" />
            <span className="text-xs font-medium text-[#5a5c3e] truncate max-w-[120px]">
              {activeTask}
            </span>
          </div>
          <div className="w-px h-4 bg-[#e0e0d8]" />
        </>
      ) : null}

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#9a9a6a]" />
          <span className="text-xs text-[#7a7a6a]">
            {focusMinutes} min hoy
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className="w-16 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(197, 199, 126, 0.2)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: '#b5b76a',
              }}
            />
          </div>
          <span className="text-xs text-[#7a7a6a] tabular-nums">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TIMER
// ============================================================================

function CallTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <span className="tabular-nums font-medium">
      {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
    </span>
  );
}

// ============================================================================
// STATUS INDICATOR
// ============================================================================

function StatusIndicator({ status, error, isMuted }: { status: string; error: string | null; isMuted: boolean }) {
  if (error) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <span className="text-red-500 text-sm">{error}</span>
      </div>
    );
  }

  if (isMuted) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#a0a090]" />
        <span className="text-[#8a8a7a] text-sm">Micrófono silenciado</span>
      </div>
    );
  }

  const statusConfig: Record<string, { color: string; text: string; pulse: boolean }> = {
    idle: { color: '#b0b0a0', text: 'Preparando...', pulse: false },
    connecting: { color: '#c5c77e', text: 'Conectando...', pulse: true },
    listening: { color: '#b5b76a', text: 'Escuchando...', pulse: true },
    speaking: { color: '#a5a75a', text: 'Hablando...', pulse: true },
    error: { color: '#e57373', text: 'Error', pulse: false },
  };

  const config = statusConfig[status] || statusConfig.idle;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-2 h-2 rounded-full ${config.pulse ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: config.color }}
      />
      <span className="text-[#7a7a6a] text-sm font-light tracking-wide">{config.text}</span>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function VoiceCoach() {
  const {
    isOpen,
    status,
    error,
    isMuted,
    messages,
    closeCoach,
    toggleMute,
  } = useVoiceCoach();

  const [toasts, setToasts] = useState<ActionToast[]>([]);
  const [showTranscript, setShowTranscript] = useState(true);

  // Track executed actions and show toasts
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'assistant') return;

    const content = lastMessage.content.toLowerCase();

    // Detect action keywords in assistant responses
    const actionPatterns = [
      { pattern: /tarea.*cread|creé.*tarea/i, type: 'task' as const, message: 'Tarea creada' },
      { pattern: /tarea.*completad|marqué.*completad/i, type: 'success' as const, message: 'Tarea completada' },
      { pattern: /sesión.*iniciad|empezamos|arrancamos/i, type: 'timer' as const, message: 'Sesión iniciada' },
      { pattern: /timer.*pausad|pausé/i, type: 'timer' as const, message: 'Timer pausado' },
      { pattern: /prioridad.*cambiad|actualicé/i, type: 'task' as const, message: 'Tarea actualizada' },
    ];

    for (const { pattern, type, message } of actionPatterns) {
      if (pattern.test(content)) {
        const newToast: ActionToast = {
          id: `${Date.now()}-${Math.random()}`,
          type,
          message,
        };
        setToasts(prev => [...prev, newToast]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== newToast.id));
        }, 3000);

        break;
      }
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes transcript-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-transcript-in {
          animation: transcript-in 0.3s ease-out forwards;
        }
        .animate-toast-in {
          animation: toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(160, 160, 140, 0.3);
          border-radius: 2px;
        }
      `}</style>

      <div
        className="fixed inset-0 z-[200] flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #f9f9f7 0%, #f5f5f2 50%, #f2f2ef 100%)',
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Subtle texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Header */}
        <header className="relative flex items-center justify-between px-5 py-4 md:px-8 md:py-5">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" className="text-[#7a7c4e]">
              <path d="M8 24C8 24 10 20 16 20C22 20 24 24 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M12 16C12 16 13 12 16 8C19 12 20 16 20 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[#8a8c5e] text-sm font-medium hidden sm:block">ToPra</span>
          </div>

          {/* Center - Title + Timer */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <div className="flex items-center gap-3 justify-center">
              <h1 className="text-lg md:text-xl font-semibold tracking-tight" style={{ color: '#4a4c3e' }}>
                Coach
              </h1>
              <span className="text-lg md:text-xl text-[#6a6c5e]">
                <CallTimer />
              </span>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={closeCoach}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 hover:bg-white/70"
            style={{
              border: '1px solid #e5e5dd',
              color: '#6a6a5a',
            }}
          >
            <X className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Cerrar</span>
          </button>
        </header>

        {/* Context Indicator */}
        <div className="flex justify-center px-4 pb-2">
          <ContextIndicator />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-4 md:px-8 -mt-4">
          {/* Blob Section */}
          <div className="relative flex flex-col items-center">
            {/* Ambient glow */}
            <div
              className="absolute rounded-full blur-3xl transition-all duration-700"
              style={{
                width: '280px',
                height: '280px',
                backgroundColor: '#c5c77e',
                opacity: status === 'speaking' ? 0.35 : status === 'listening' ? 0.28 : 0.15,
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%',
              }}
            />

            {/* Blob */}
            <div className="relative">
              <VoiceBlob status={status} />

              {/* Connecting overlay */}
              {status === 'connecting' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#7a7c4e] animate-spin" />
                </div>
              )}
            </div>

            {/* Status */}
            <div className="mt-6">
              <StatusIndicator status={status} error={error} isMuted={isMuted} />
            </div>
          </div>

          {/* Transcription Panel */}
          {showTranscript && (
            <div
              className="w-full md:w-80 h-48 md:h-72 rounded-2xl p-4 transition-all duration-500"
              style={{
                background: 'rgba(255, 255, 253, 0.6)',
                border: '1px solid rgba(197, 199, 126, 0.15)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#8a8a7a] uppercase tracking-wider">
                  Conversación
                </span>
                <button
                  onClick={() => setShowTranscript(false)}
                  className="text-[#a0a090] hover:text-[#7a7a6a] transition-colors md:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="h-[calc(100%-28px)]">
                <TranscriptionPanel messages={messages} />
              </div>
            </div>
          )}

          {/* Show transcript button on mobile */}
          {!showTranscript && (
            <button
              onClick={() => setShowTranscript(true)}
              className="md:hidden px-4 py-2 rounded-full text-sm text-[#7a7a6a] border border-[#e5e5dd] hover:bg-white/50"
            >
              Mostrar conversación
            </button>
          )}
        </main>

        {/* Footer Controls */}
        <footer className="flex justify-center pb-6 md:pb-10 pt-4">
          <div
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-full"
            style={{
              background: 'rgba(255, 255, 253, 0.85)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
              border: '1px solid rgba(230, 230, 220, 0.6)',
            }}
          >
            {/* Mute */}
            <button
              onClick={toggleMute}
              disabled={status === 'connecting'}
              className="flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 hover:bg-white/80 disabled:opacity-50"
              style={{ color: isMuted ? '#9a9a8a' : '#6a6c4e' }}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span className="text-sm font-medium">{isMuted ? 'Activar' : 'Silenciar'}</span>
            </button>

            <div className="w-px h-7 bg-[#e8e8e0]" />

            {/* End */}
            <button
              onClick={closeCoach}
              className="flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 hover:bg-red-50/80"
              style={{ color: '#c45c5c' }}
            >
              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: '#c45c5c' }}>
                <Phone className="w-3 h-3 text-white transform rotate-[135deg]" />
              </div>
              <span className="text-sm font-medium">Terminar</span>
            </button>
          </div>
        </footer>

        {/* Listening Ring Animation */}
        {status === 'listening' && !isMuted && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ marginTop: '-5%' }}>
            <div
              className="w-72 h-72 md:w-80 md:h-80 rounded-full border animate-ping-slow"
              style={{ borderColor: 'rgba(197, 199, 126, 0.25)', borderWidth: '1.5px' }}
            />
          </div>
        )}

        {/* Action Toasts */}
        <ActionToasts toasts={toasts} />
      </div>
    </>
  );
}
