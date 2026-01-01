'use client';

import { useState, useEffect } from 'react';

const motivationalMessages = [
  "¡Mantén el enfoque! Cada minuto cuenta.",
  "Estás haciendo un gran trabajo. ¡Sigue así!",
  "La concentración es la clave del éxito.",
  "Un paso a la vez, estás progresando.",
  "Tu dedicación te llevará lejos.",
  "Cada sesión de enfoque te acerca a tus metas.",
  "La excelencia es un hábito. ¡Sigue construyéndolo!",
  "Respira profundo y mantén la calma.",
  "Tu futuro se construye en estos momentos.",
  "¡La persistencia vence la resistencia!"
];

interface MotivationalMessageProps {
  isRunning: boolean;
  sessionType: 'focus' | 'break';
}

export function MotivationalMessage({ isRunning, sessionType }: MotivationalMessageProps) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isRunning || sessionType !== 'focus') {
      setMessage('');
      return;
    }

    // Set initial message
    setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);

    // Change message every 2 minutes
    const interval = setInterval(() => {
      setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isRunning, sessionType]);

  if (!message) return null;

  return (
    <div className="text-center mt-4 animate-fade-in">
      <p className="text-sm text-muted-foreground italic">{message}</p>
    </div>
  );
} 