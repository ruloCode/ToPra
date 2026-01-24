export interface VoiceCoachSettings {
  enabled: boolean;
  voiceId: string;
  autoListen: boolean;
  showTranscript: boolean;
}

export interface AudioSettings {
  enabled: boolean;
  volume: number;
  voiceId: string;
  preferences: {
    timerSounds: boolean;
    motivationalVoice: boolean;
    aiVoice: boolean;
    notificationSounds: boolean;
    ambientMusic: boolean;
  };
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es';
  notifications: {
    email: boolean;
    pushNotifications: boolean;
    soundEffects: boolean;
  };
  focusMode: {
    defaultDuration: number;
    autoStartBreaks: boolean;
    showMotivationalMessages: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
  };
  profile: {
    displayName: string;
    timeZone: string;
    weekStartsOn: 'sunday' | 'monday';
  };
  voiceCoach: VoiceCoachSettings;
  audio: AudioSettings;
}

export const defaultSettings: UserSettings = {
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    pushNotifications: true,
    soundEffects: true,
  },
  focusMode: {
    defaultDuration: 25,
    autoStartBreaks: false,
    showMotivationalMessages: true,
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    largeText: false,
  },
  profile: {
    displayName: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekStartsOn: 'monday',
  },
  voiceCoach: {
    enabled: true,
    voiceId: 'cgSgspJ2msm6clMCkdW9', // Jessica - voz por defecto de ElevenLabs
    autoListen: false,
    showTranscript: true,
  },
  audio: {
    enabled: true,
    volume: 80,
    voiceId: 'cgSgspJ2msm6clMCkdW9',
    preferences: {
      timerSounds: true,
      motivationalVoice: true,
      aiVoice: false,
      notificationSounds: true,
      ambientMusic: false,
    },
  },
};

export const languages = {
  en: {
    name: 'English',
    label: 'English',
  },
  es: {
    name: 'Spanish',
    label: 'Español',
  },
};

export function loadUserSettings(userId: string): UserSettings {
  const localSettings = localStorage.getItem(`user_settings_${userId}`);
  if (localSettings) {
    return { ...defaultSettings, ...JSON.parse(localSettings) };
  }
  return defaultSettings;
}

export function saveUserSettings(userId: string, settings: UserSettings): void {
  localStorage.setItem(`user_settings_${userId}`, JSON.stringify(settings));
}

export function validateSettings(settings: Partial<UserSettings>) {
  const errors: { field: string; message: string }[] = [];

  // Validate theme
  if (settings.theme && !['light', 'dark', 'system'].includes(settings.theme)) {
    errors.push({ field: 'theme', message: 'Invalid theme selection' });
  }

  // Validate language
  if (settings.language && !Object.keys(languages).includes(settings.language)) {
    errors.push({ field: 'language', message: 'Invalid language selection' });
  }

  // Validate focus duration
  if (settings.focusMode?.defaultDuration) {
    const duration = settings.focusMode.defaultDuration;
    if (duration < 1 || duration > 120) {
      errors.push({ 
        field: 'focusMode.defaultDuration', 
        message: 'Duration must be between 1 and 120 minutes' 
      });
    }
  }

  // Validate timezone
  if (settings.profile?.timeZone) {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: settings.profile.timeZone });
    } catch {
      errors.push({ field: 'profile.timeZone', message: 'Invalid timezone' });
    }
  }

  return errors;
}

export function applyLanguage(language: string) {
  document.documentElement.lang = language;
}

export function initializeSettings(settings: UserSettings) {
  // Apply theme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = settings.theme === 'dark' || 
    (settings.theme === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', isDark);

  // Apply accessibility settings
  document.documentElement.classList.toggle('high-contrast', settings.accessibility.highContrast);
  document.documentElement.classList.toggle('reduce-motion', settings.accessibility.reducedMotion);
  document.documentElement.classList.toggle('large-text', settings.accessibility.largeText);

  // Apply language
  applyLanguage(settings.language);
}