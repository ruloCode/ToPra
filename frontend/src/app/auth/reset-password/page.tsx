'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { translateAuthError } from '@/lib/auth-errors';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Escuchar evento PASSWORD_RECOVERY para saber que el usuario viene del link
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsReady(true);
        }
      }
    );

    // También verificar si ya hay una sesión activa (para el caso de SSR)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(translateAuthError(err instanceof Error ? err.message : 'Error'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-default p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-background-paper rounded-lg p-8 shadow-lg border border-accent/10">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-text-primary">
              ¡Contraseña actualizada!
            </h1>
            <p className="text-text-secondary">
              Tu contraseña ha sido cambiada exitosamente. Redirigiendo...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-default p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-background-paper rounded-lg p-8 shadow-lg border border-accent/10">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-accent/10 rounded-full">
                <Lock className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-text-primary">
              Verificando enlace...
            </h1>
            <p className="text-text-secondary">
              Por favor espera mientras verificamos tu enlace de recuperación.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-default p-4">
      <div className="max-w-md w-full">
        <div className="bg-background-paper rounded-lg p-8 shadow-lg border border-accent/10">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-accent/10 rounded-full">
              <Lock className="h-8 w-8 text-accent" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2 text-text-primary text-center">
            Nueva contraseña
          </h1>
          <p className="text-text-secondary mb-6 text-center">
            Ingresa tu nueva contraseña.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-background-default border-accent/20 text-text-primary placeholder:text-text-secondary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="bg-background-default border-accent/20 text-text-primary placeholder:text-text-secondary"
            />

            {error && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
