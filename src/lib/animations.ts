/**
 * Animation utilities and presets for ToPra UI
 */

// Transition presets for consistent animations
export const transitions = {
  fast: 'transition-all duration-150 ease-out',
  normal: 'transition-all duration-200 ease-out',
  slow: 'transition-all duration-300 ease-out',
  colors: 'transition-colors duration-200 ease-out',
  transform: 'transition-transform duration-200 ease-out',
  opacity: 'transition-opacity duration-200 ease-out',
} as const;

// Animation class names
export const animations = {
  fadeIn: 'animate-fade-in',
  taskComplete: 'animate-task-complete',
  shimmer: 'animate-shimmer',
  timerPulse: 'animate-timer-pulse',
  slideIn: 'animate-slide-in',
  slideInRight: 'animate-slide-in-right',
  scaleIn: 'animate-scale-in',
} as const;

// Hover effects
export const hoverEffects = {
  lift: 'hover:-translate-y-0.5 hover:shadow-md',
  scale: 'hover:scale-[1.02]',
  glow: 'hover:shadow-lg hover:shadow-primary-main/20',
  brighten: 'hover:brightness-110',
} as const;

// Active/pressed effects
export const activeEffects = {
  press: 'active:scale-[0.98]',
  dim: 'active:opacity-80',
} as const;

// Combined interaction classes
export const interactions = {
  button: `${transitions.fast} ${activeEffects.press}`,
  card: `${transitions.normal} ${hoverEffects.lift}`,
  link: `${transitions.colors} hover:text-accent`,
} as const;

// Stagger delay generator for list animations
export const getStaggerDelay = (index: number, baseDelay = 50): string => {
  return `${index * baseDelay}ms`;
};

// Style object for staggered animations
export const getStaggerStyle = (index: number, baseDelay = 50): React.CSSProperties => {
  return { animationDelay: getStaggerDelay(index, baseDelay) };
};
