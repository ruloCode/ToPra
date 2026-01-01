'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { translateAuthError } from '@/lib/auth-errors';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setMessage('Te hemos enviado un email con instrucciones para restablecer tu contraseña.');
    } catch (err) {
      setError(translateAuthError(err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-default p-4">
      <div className="max-w-md w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a iniciar sesión
        </Link>

        <div className="bg-background-paper rounded-lg p-8 shadow-lg border border-accent/10">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-accent/10 rounded-full">
              <Mail className="h-8 w-8 text-accent" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2 text-text-primary text-center">
            Recuperar contraseña
          </h1>
          <p className="text-text-secondary mb-6 text-center">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background-default border-accent/20 text-text-primary placeholder:text-text-secondary"
            />

            {error && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-500/10 text-green-500 p-3 rounded text-sm">
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
