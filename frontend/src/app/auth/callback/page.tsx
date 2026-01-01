'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase client detectará automáticamente el código en la URL
        // y lo intercambiará por una sesión usando el code_verifier almacenado
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error.message);
          setError(error.message);
          setTimeout(() => router.replace('/?error=auth_callback_error'), 2000);
          return;
        }

        if (data.session) {
          router.replace('/tasks');
        } else {
          // Si no hay sesión, intentar intercambiar el código manualmente
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');

          if (code) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
              console.error('Exchange error:', exchangeError.message);
              setError(exchangeError.message);
              setTimeout(() => router.replace('/?error=auth_callback_error'), 2000);
              return;
            }

            router.replace('/tasks');
          } else {
            router.replace('/?error=no_code');
          }
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('Error inesperado');
        setTimeout(() => router.replace('/?error=auth_callback_error'), 2000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-default">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-500 mb-4">Error: {error}</div>
            <p className="text-text-secondary">Redirigiendo...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main mx-auto mb-4"></div>
            <p className="text-text-secondary">Completando inicio de sesión...</p>
          </>
        )}
      </div>
    </div>
  );
}
