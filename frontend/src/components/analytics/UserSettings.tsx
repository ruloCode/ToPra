"use client";
import { useState, useEffect } from 'react';
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
  }, [isDark]);

  const handleFocusSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.querySelector<HTMLElement>('input, button')?.focus();
  };

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
  }, []);

  const saveSettings = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      saveUserSettings(user.id, settings);
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });

      // Apply settings
      applySettings(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const applySettings = (settings: UserSettings) => {
    // Apply theme
    document.documentElement.className = settings.theme === 'dark' ? 'dark' : '';
    
    // Apply accessibility settings
    if (settings.accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (settings.accessibility.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    if (settings.accessibility.largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  };

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
        <h3 className="text-lg font-semibold mb-4" tabIndex={0}>Profile Settings</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Display Name</label>
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
              placeholder="Your name"
            />
          </div>

         
        </div>
      </Card>

      <Card className="p-6" id="appearance-section">
        <h3 className="text-lg font-semibold mb-4" tabIndex={0}>Appearance Settings</h3>
        <div className="space-y-4" role="group" aria-label="Appearance settings">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Theme</label>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/10">
                {isDark ? 'Dark' : 'Light'} mode active
              </span>
            </div>
            <Select
              value={settings.theme}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className='bg-white border-border'>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
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
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}