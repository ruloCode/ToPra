'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { translateAuthError } from '@/lib/auth-errors';
import GoogleSignInButton from './GoogleSignInButton';
import Link from 'next/link';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(translateAuthError(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-background-default">
      <div className="p-8 lg:p-12 flex flex-col bg-background-default max-w-md w-full lg:w-1/2">
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-4xl font-semibold text-text-primary mb-2">
              {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            </h2>
            <p className="text-text-secondary">
              {isSignUp ? (
                <>
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-accent hover:text-accent/80"
                  >
                    Iniciar sesión
                  </button>
                </>
              ) : (
                <>
                  ¿No tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-accent hover:text-accent/80"
                  >
                    Crear cuenta
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Google Sign In */}
          <div className="mb-6">
            <GoogleSignInButton className="w-full" />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-accent/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background-default px-2 text-text-secondary">
                o continúa con email
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleAuth}>
            <Input
              type="email"
              placeholder="Email"
              className="bg-background-paper border-accent/20 text-text-primary placeholder:text-text-secondary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                className="bg-background-paper border-accent/20 text-text-primary placeholder:text-text-secondary pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {!isSignUp && (
              <div className="text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-accent hover:text-accent/80"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={loading}
            >
              {loading ? (
                'Cargando...'
              ) : isSignUp ? (
                'Crear cuenta'
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
