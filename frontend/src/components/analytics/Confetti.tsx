"use client";
import  { useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  duration?: number;
}

export default function Confetti({ duration = 3000 }: ConfettiProps) {
  const triggerConfetti = useCallback(() => {
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [duration]);

  useEffect(() => {
    triggerConfetti();
  }, [triggerConfetti]);

  return null;
}