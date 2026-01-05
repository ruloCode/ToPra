"use client";
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { defaultSettings, loadUserSettings, saveUserSettings } from '@/lib/settings';
import type { UserSettings } from '@/lib/settings';
import ChangePassword from '@/components/settings/ChangePassword';

export default function UserSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (user) {
      const userSettings = loadUserSettings(user.id);
      setSettings(userSettings);
    }
  }, [user]);

  useEffect(() => {
    const themeValue = isDark ? 'dark' : 'light';
    if (themeValue !== settings.theme) {
      setSettings(prev => ({ ...prev, theme: themeValue }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  const handleFocusSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.querySelector<HTMLElement>('input, button')?.focus();
  };

  const applySettings = useCallback((settingsToApply: UserSettings) => {
    // Apply theme
    document.documentElement.className = settingsToApply.theme === 'dark' ? 'dark' : '';

    // Apply accessibility settings
    if (settingsToApply.accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (settingsToApply.accessibility.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    if (settingsToApply.accessibility.largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, []);

  const saveSettings = useCallback(async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      saveUserSettings(user.id, settings);

      toast({
        title: "Configuración guardada",
        description: "Tus preferencias han sido actualizadas correctamente.",
      });

      // Apply settings
      applySettings(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error al guardar la configuración",
        description: "Por favor, intenta de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, settings, toast, applySettings]);

  useEffect(() => {
    function handleKeyboardShortcuts(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveSettings();
            break;
          case ',':
            e.preventDefault();
            handleFocusSection('profile-section');
            break;
          case '1':
            e.preventDefault();
            handleFocusSection('profile-section');
            break;
          case '2':
            e.preventDefault();
            handleFocusSection('appearance-section');
            break;
          case '3':
            e.preventDefault();
            handleFocusSection('notifications-section');
            break;
          case '4':
            e.preventDefault();
            handleFocusSection('focus-section');
            break;
          case '5':
            e.preventDefault();
            handleFocusSection('accessibility-section');
            break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [saveSettings]);

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme: value }));
    
    if (value === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark !== isDark) {
        toggleTheme();
      }
    } else {
      const shouldBeDark = value === 'dark';
      if (shouldBeDark !== isDark) {
        toggleTheme();
      }
    }
  };

  return (
    <div className="space-y-6 settings-section" role="form" aria-label="User settings">
      <Card className="p-6" id="profile-section">
        <h3 className="text-lg font-semibold mb-4" tabIndex={0}>Configuración del perfil</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Nombre para mostrar</label>
            <input
              type="text"
              value={settings.profile.displayName}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, displayName: e.target.value }
                }))
              }
              className="w-[180px] px-3 py-2 rounded-md border border-input bg-white dark:bg-zinc-900 dark:text-white"
              placeholder="Tu nombre"
            />
          </div>

         
        </div>
      </Card>

      <Card className="p-6" id="appearance-section">
        <h3 className="text-lg font-semibold mb-4" tabIndex={0}>Configuración de apariencia</h3>
        <div className="space-y-4" role="group" aria-label="Configuración de apariencia">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Tema</label>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/10">
                Modo {isDark ? 'oscuro' : 'claro'} activo
              </span>
            </div>
            <Select
              value={settings.theme}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar tema" />
              </SelectTrigger>
              <SelectContent className='bg-white border-border'>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Oscuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Language</label>
            <Select
              value={settings.language}
              onValueChange={(value: 'en' | 'es') => 
                setSettings(prev => ({ ...prev, language: value }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className='bg-white border-border'>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
      </Card>

      {/* Security Section - Change Password */}
      <ChangePassword />

      {/* <Card className="p-6" id="accessibility-section">
        <h3 className="text-lg font-semibold mb-4" tabIndex={0}>Accessibility Options</h3>
        <div className="space-y-4" role="group" aria-label="Accessibility settings">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">High Contrast</label>
            <Switch
              checked={settings.accessibility.highContrast}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  accessibility: { ...prev.accessibility, highContrast: checked }
                }))
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Reduced Motion</label>
            <Switch
              checked={settings.accessibility.reducedMotion}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  accessibility: { ...prev.accessibility, reducedMotion: checked }
                }))
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Large Text</label>
            <Switch
              checked={settings.accessibility.largeText}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  accessibility: { ...prev.accessibility, largeText: checked }
                }))
              }
            />
          </div>
        </div>
      </Card> */}

      <div className="flex justify-end items-center">
        <Button
          onClick={saveSettings}
          disabled={isSaving}
          className="min-w-[120px]"
          aria-live="polite"
          
        >
          {isSaving ? "Guardando..." : "Guardar configuración"}
        </Button>
      </div>
    </div>
  );
}