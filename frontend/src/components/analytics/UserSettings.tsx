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
import { Switch } from "@radix-ui/react-switch";
import { Button } from '../ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '../ui/use-toast';

interface UserSettings {
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
}

const defaultSettings: UserSettings = {
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
};

export default function UserSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function loadSettings() {
      if (!user) return;
      
      const { data: userSettings } = await supabase
        .from('users')
        .select('settings')
        .eq('id', user.id)
        .single();

      if (userSettings?.settings) {
        setSettings({ ...defaultSettings, ...userSettings.settings });
      }
    }

    loadSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({ settings })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
        variant: "default",
        className: "bg-green-50 border-green-200",
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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Theme</label>
            <Select
              value={settings.theme}
              onValueChange={(value: 'light' | 'dark' | 'system') => 
                setSettings(prev => ({ ...prev, theme: value }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
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
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Email Notifications</label>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: checked }
                }))
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Push Notifications</label>
            <Switch
              checked={settings.notifications.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, pushNotifications: checked }
                }))
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Sound Effects</label>
            <Switch
              checked={settings.notifications.soundEffects}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, soundEffects: checked }
                }))
              }
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Focus Mode</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Default Duration (minutes)</label>
            <Select
              value={settings.focusMode.defaultDuration.toString()}
              onValueChange={(value) =>
                setSettings(prev => ({
                  ...prev,
                  focusMode: { ...prev.focusMode, defaultDuration: parseInt(value) }
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Auto-start Breaks</label>
            <Switch
              checked={settings.focusMode.autoStartBreaks}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  focusMode: { ...prev.focusMode, autoStartBreaks: checked }
                }))
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Show Motivational Messages</label>
            <Switch
              checked={settings.focusMode.showMotivationalMessages}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  focusMode: { ...prev.focusMode, showMotivationalMessages: checked }
                }))
              }
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Accessibility</h3>
        <div className="space-y-4">
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
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={saveSettings}
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}