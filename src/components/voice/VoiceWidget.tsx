'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';
import { useVoiceCoach } from '@/contexts/VoiceCoachContext';

// ============================================================================
// MINI BLOB COMPONENT
// ============================================================================

function MiniBlob({ status }: { status: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const currentParamsRef = useRef({ amplitude: 2, speed: 0.02 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 40;
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = size * 0.7;

    const getTargetParams = () => {
      switch (status) {
        case 'listening':
          return { amplitude: 4, speed: 0.04, color: '#b5b76a' };
        case 'speaking':
          return { amplitude: 6, speed: 0.06, color: '#a5a75a' };
        case 'connecting':
          return { amplitude: 2.5, speed: 0.03, color: '#c0c27a' };
        default:
          return { amplitude: 2, speed: 0.02, color: '#c5c77e' };
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      const target = getTargetParams();

      currentParamsRef.current.amplitude = lerp(
        currentParamsRef.current.amplitude,
        target.amplitude,
        0.1
      );
      currentParamsRef.current.speed = lerp(
        currentParamsRef.current.speed,
        target.speed,
        0.1
      );

      timeRef.current += currentParamsRef.current.speed;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Outer glow
      ctx.beginPath();
      const glowPoints = 48;
      for (let i = 0; i <= glowPoints; i++) {
        const angle = (i / glowPoints) * Math.PI * 2;
        const noise1 = Math.sin(angle * 3 + timeRef.current * 1.5) * (currentParamsRef.current.amplitude * 1.2);
        const noise2 = Math.sin(angle * 5 - timeRef.current) * (currentParamsRef.current.amplitude * 0.5);
        const r = baseRadius * 1.15 + noise1 + noise2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = `${target.color}20`;
      ctx.fill();

      // Main blob
      ctx.beginPath();
      const points = 60;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const noise1 = Math.sin(angle * 3 + timeRef.current * 2) * currentParamsRef.current.amplitude;
        const noise2 = Math.sin(angle * 5 - timeRef.current * 1.5) * (currentParamsRef.current.amplitude * 0.5);
        const noise3 = Math.sin(angle * 7 + timeRef.current * 2.5) * (currentParamsRef.current.amplitude * 0.25);
        const r = baseRadius + noise1 + noise2 + noise3;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const gradient = ctx.createRadialGradient(
        centerX - baseRadius * 0.2,
        centerY - baseRadius * 0.2,
        0,
        centerX,
        centerY,
        baseRadius * 1.1
      );
      gradient.addColorStop(0, adjustColor(target.color, 15));
      gradient.addColorStop(0.6, target.color);
      gradient.addColorStop(1, adjustColor(target.color, -15));
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.arc(
        centerX - baseRadius * 0.15,
        centerY - baseRadius * 0.15,
        baseRadius * 0.15,
        0,
        Math.PI * 2
      );
      const highlightGradient = ctx.createRadialGradient(
        centerX - baseRadius * 0.15,
        centerY - baseRadius * 0.15,
        0,
        centerX - baseRadius * 0.15,
        centerY - baseRadius * 0.15,
        baseRadius * 0.15
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = highlightGradient;
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [status]);

  return <canvas ref={canvasRef} className="flex-shrink-0" />;
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
// CALL TIMER
// ============================================================================

function CallTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <span className="tabular-nums text-xs opacity-70">
      {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
    </span>
  );
}

// ============================================================================
// STATUS TEXT
// ============================================================================

const STATUS_TEXT: Record<string, string> = {
  idle: 'Preparando...',
  connecting: 'Conectando...',
  listening: 'Escuchando...',
  speaking: 'Habla para interrumpir',
  error: 'Error de conexión',
};

// ============================================================================
// MAIN WIDGET COMPONENT
// ============================================================================

export function VoiceWidget() {
  const { isOpen, status, error, closeCoach } = useVoiceCoach();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      closeCoach();
      setIsExiting(false);
    }, 200);
  };

  if (!isOpen) return null;

  const displayStatus = error ? 'error' : status;
  const statusText = error || STATUS_TEXT[displayStatus] || STATUS_TEXT.idle;

  return (
    <>
      <style jsx global>{`
        @keyframes voice-widget-in {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes voice-widget-out {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
        }
        .voice-widget-enter {
          animation: voice-widget-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .voice-widget-exit {
          animation: voice-widget-out 0.2s ease-out forwards;
        }
        @keyframes subtle-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`fixed top-4 right-4 z-[150] ${
          isExiting ? 'voice-widget-exit' : 'voice-widget-enter'
        }`}
        style={{
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 253, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(197, 199, 126, 0.25)',
            boxShadow:
              '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Mini Blob */}
          <div className="relative">
            <MiniBlob status={displayStatus} />
            {status === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-[#7a7c4e] animate-spin" />
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col min-w-[120px]">
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-semibold tracking-tight"
                style={{ color: '#4a4c3e' }}
              >
                Coach
              </span>
              <CallTimer />
            </div>
            <span
              className={`text-xs font-medium ${
                status === 'listening' || status === 'speaking'
                  ? 'animate-subtle-pulse'
                  : ''
              }`}
              style={{
                color:
                  displayStatus === 'error'
                    ? '#c45c5c'
                    : displayStatus === 'speaking'
                    ? '#7a7c4e'
                    : '#8a8a7a',
              }}
            >
              {statusText}
            </span>
          </div>

          {/* Divider */}
          <div
            className="w-px h-8 mx-1"
            style={{ backgroundColor: 'rgba(197, 199, 126, 0.3)' }}
          />

          {/* End Call Button */}
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: 'rgba(196, 92, 92, 0.1)',
            }}
            aria-label="Terminar llamada"
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#c45c5c' }}
            >
              <Phone
                className="w-3.5 h-3.5 text-white"
                style={{ transform: 'rotate(135deg)' }}
              />
            </div>
          </button>
        </div>

        {/* Status indicator dot for speaking state */}
        {status === 'speaking' && (
          <div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
            style={{
              backgroundColor: '#a5a75a',
              boxShadow: '0 0 8px rgba(165, 167, 90, 0.6)',
            }}
          />
        )}
      </div>
    </>
  );
}
