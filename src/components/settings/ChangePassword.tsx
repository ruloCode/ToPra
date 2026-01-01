'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { translateAuthError } from '@/lib/auth-errors';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña ha sido cambiada exitosamente.',
      });

      // Limpiar formulario
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast({
        title: 'Error',
        description: translateAuthError(err instanceof Error ? err.message : 'Error'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6" id="security-section">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold" tabIndex={0}>
          Cambiar contraseña
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-2">
            Nueva contraseña
          </label>
          <div className="relative">
            <Input
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className="pr-10 bg-white dark:bg-zinc-900"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">
            Confirmar nueva contraseña
          </label>
          <Input
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite la contraseña"
            required
            minLength={6}
            className="bg-white dark:bg-zinc-900"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Guardando...' : 'Cambiar contraseña'}
        </Button>
      </form>
    </Card>
  );
}
