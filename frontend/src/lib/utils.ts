import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface SettingsValidationError {
  field: string;
  message: string;
}

interface UserSettings {
  profile?: {
    displayName?: string;
    timeZone?: string;
    weekStartsOn?: 'sunday' | 'monday';
  };
  theme?: 'light' | 'dark';
  language?: 'en' | 'es';
  focusMode?: {
    defaultDuration?: number;
  };
  accessibility?: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    largeText?: boolean;
  };
}

export function validateSettings(settings: UserSettings): SettingsValidationError[] {
  const errors: SettingsValidationError[] = [];

  // Validate profile settings
  const displayName = settings.profile?.displayName;
  if (displayName && displayName.length > 50) {
    errors.push({ field: 'displayName', message: 'Display name must be less than 50 characters' });
  }

  const timeZone = settings.profile?.timeZone;
  if (timeZone && !Intl.supportedValuesOf('timeZone').includes(timeZone)) {
    errors.push({ field: 'timeZone', message: 'Invalid timezone' });
  }

  const weekStartsOn = settings.profile?.weekStartsOn;
  if (weekStartsOn && !['sunday', 'monday'].includes(weekStartsOn)) {
    errors.push({ field: 'weekStartsOn', message: 'Week must start on Sunday or Monday' });
  }

  // Validate theme settings
  const theme = settings.theme;
  if (theme && !['light', 'dark'].includes(theme)) {
    errors.push({ field: 'theme', message: 'Invalid theme selection' });
  }

  // Validate language settings
  const language = settings.language;
  if (language && !['en', 'es'].includes(language)) {
    errors.push({ field: 'language', message: 'Invalid language selection' });
  }

  // Validate focus mode settings
  const defaultDuration = settings.focusMode?.defaultDuration;
  if (typeof defaultDuration === 'number' && (defaultDuration < 1 || defaultDuration > 120)) {
    errors.push({ field: 'defaultDuration', message: 'Duration must be between 1 and 120 minutes' });
  }

  return errors;
}

export function applyAccessibilitySettings(settings: UserSettings) {
  const html = document.documentElement;
  
  // Apply high contrast
  html.classList.toggle('high-contrast', settings.accessibility?.highContrast);
  
  // Apply reduced motion
  html.classList.toggle('reduce-motion', settings.accessibility?.reducedMotion);
  
  // Apply large text
  html.classList.toggle('large-text', settings.accessibility?.largeText);
  
  // Apply theme
  html.classList.toggle('dark', settings.theme === 'dark');
}

// Add matching media query listener for system theme
export function initializeSystemThemeListener(callback: (isDark: boolean) => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => callback(e.matches));
  return () => mediaQuery.removeEventListener('change', (e) => callback(e.matches));
}