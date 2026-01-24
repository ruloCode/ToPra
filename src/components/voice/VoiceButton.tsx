'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { useVoiceCoach } from '@/contexts/VoiceCoachContext';
import { cn } from '@/lib/utils';

// ============================================================================
// WAVE ANIMATION COMPONENT
// ============================================================================

function WaveRings({ isActive, status }: { isActive: boolean; status: string }) {
  if (!isActive) return null;

  const ringColor = status === 'listening'
    ? 'rgba(181, 183, 106, 0.4)'
    : status === 'speaking'
    ? 'rgba(165, 167, 90, 0.35)'
    : 'rgba(197, 199, 126, 0.3)';

  return (
    <>
      {/* Inner ring */}
      <span
        className="absolute inset-0 rounded-full animate-wave-1"
        style={{
          border: `2px solid ${ringColor}`,
          transform: 'scale(1)',
        }}
      />
      {/* Middle ring */}
      <span
        className="absolute inset-0 rounded-full animate-wave-2"
        style={{
          border: `1.5px solid ${ringColor}`,
          transform: 'scale(1)',
        }}
      />
      {/* Outer ring */}
      <span
        className="absolute inset-0 rounded-full animate-wave-3"
        style={{
          border: `1px solid ${ringColor}`,
          transform: 'scale(1)',
        }}
      />
    </>
  );
}

// ============================================================================
// FLOATING ORB BACKGROUND
// ============================================================================

function FloatingOrb({ status }: { status: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 56;
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = size * 0.75;

    const getParams = () => {
      switch (status) {
        case 'listening':
          return { amplitude: 4, speed: 0.04, color: '#b5b76a' };
        case 'speaking':
          return { amplitude: 6, speed: 0.06, color: '#a5a75a' };
        case 'connecting':
          return { amplitude: 2, speed: 0.03, color: '#c5c77e' };
        default:
          return { amplitude: 1.5, speed: 0.015, color: '#c5c77e' };
      }
    };

    const animate = () => {
      const params = getParams();
      timeRef.current += params.speed;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw organic blob
      ctx.beginPath();
      const points = 60;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const noise1 = Math.sin(angle * 3 + timeRef.current * 2) * params.amplitude;
        const noise2 = Math.sin(angle * 5 - timeRef.current * 1.5) * (params.amplitude * 0.5);
        const r = baseRadius + noise1 + noise2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Gradient fill
      const gradient = ctx.createRadialGradient(
        centerX - baseRadius * 0.2,
        centerY - baseRadius * 0.2,
        0,
        centerX,
        centerY,
        baseRadius * 1.1
      );
      gradient.addColorStop(0, adjustColor(params.color, 15));
      gradient.addColorStop(0.6, params.color);
      gradient.addColorStop(1, adjustColor(params.color, -20));
      ctx.fillStyle = gradient;
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [status]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 rounded-full"
      style={{ opacity: 0.95 }}
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
// MAIN BUTTON COMPONENT
// ============================================================================

export function VoiceButton() {
  const { status, isOpen, toggleCoach, isSupported } = useVoiceCoach();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Hide button when voice coach is open (widget is shown instead)
  if (!isSupported || isOpen) {
    return null;
  }

  const isActive = status === 'listening' || status === 'speaking';
  const isConnecting = status === 'connecting';

  const getIcon = () => {
    switch (status) {
      case 'listening':
        return <Mic className="w-6 h-6" />;
      case 'connecting':
        return <Loader2 className="w-6 h-6 animate-spin" />;
      case 'speaking':
        return <Volume2 className="w-6 h-6" />;
      case 'error':
        return <MicOff className="w-6 h-6" />;
      default:
        return <Mic className="w-6 h-6" />;
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes wave-1 {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        @keyframes wave-2 {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes wave-3 {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(2.6);
            opacity: 0;
          }
        }
        .animate-wave-1 {
          animation: wave-1 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-wave-2 {
          animation: wave-2 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 0.4s;
        }
        .animate-wave-3 {
          animation: wave-3 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 0.8s;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <button
        onClick={toggleCoach}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className={cn(
          'fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50',
          'w-14 h-14 rounded-full',
          'flex items-center justify-center',
          'transition-all duration-300 ease-out',
          'focus:outline-none',
          !isActive && !isConnecting && 'animate-float',
          isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'
        )}
        style={{
          boxShadow: isActive
            ? '0 8px 32px rgba(181, 183, 106, 0.4), 0 4px 16px rgba(0,0,0,0.08)'
            : isHovered
            ? '0 12px 40px rgba(197, 199, 126, 0.35), 0 4px 12px rgba(0,0,0,0.08)'
            : '0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        }}
        aria-label={isOpen ? 'Cerrar coach de voz' : 'Abrir coach de voz'}
        title="Coach de Productividad"
      >
        {/* Animated organic background */}
        <FloatingOrb status={status} />

        {/* Wave rings when active */}
        <WaveRings isActive={isActive && !isOpen} status={status} />

        {/* Icon container */}
        <div
          className={cn(
            'relative z-10 flex items-center justify-center',
            'transition-all duration-300',
            isActive && 'animate-pulse'
          )}
          style={{
            color: '#ffffff',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
          }}
        >
          {getIcon()}
        </div>

        {/* Active indicator ring */}
        {isOpen && (
          <span
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid rgba(255, 255, 255, 0.5)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        )}

        {/* Subtle glow on hover */}
        <div
          className={cn(
            'absolute inset-0 rounded-full transition-opacity duration-300',
            isHovered && !isActive ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          }}
        />
      </button>

      {/* Tooltip on hover (desktop only) */}
      {isHovered && !isOpen && (
        <div
          className="fixed bottom-20 right-20 md:bottom-6 md:right-24 z-50 hidden md:block animate-fade-in"
          style={{
            animation: 'fadeIn 0.2s ease-out forwards',
          }}
        >
          <div
            className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
            style={{
              background: 'rgba(58, 60, 46, 0.95)',
              color: '#f5f5f2',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            Habla con tu Coach
            <div
              className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rotate-45"
              style={{ background: 'rgba(58, 60, 46, 0.95)' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
