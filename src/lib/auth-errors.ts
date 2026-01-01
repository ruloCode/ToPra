// Mapeo de errores de Supabase Auth a español
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Errores de login
  'Invalid login credentials': 'Credenciales inválidas. Verifica tu email y contraseña.',
  'Email not confirmed': 'Tu email no ha sido confirmado. Revisa tu bandeja de entrada.',
  'Invalid email or password': 'Email o contraseña incorrectos.',
  'invalid_credentials': 'Email o contraseña incorrectos.',

  // Errores de signup
  'User already registered': 'Este email ya está registrado. Intenta iniciar sesión.',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  'Password should be at least 6 characters.': 'La contraseña debe tener al menos 6 caracteres.',
  'Unable to validate email address: invalid format': 'El formato del email no es válido.',
  'Signup requires a valid password': 'Se requiere una contraseña válida.',

  // Errores de reset password
  'Email rate limit exceeded': 'Demasiados intentos. Espera unos minutos antes de intentar de nuevo.',
  'For security purposes, you can only request this once every 60 seconds': 'Por seguridad, solo puedes solicitar esto una vez cada 60 segundos.',
  'Email link is invalid or has expired': 'El enlace ha expirado. Solicita uno nuevo.',

  // Errores de cambio de contraseña
  'New password should be different from the old password': 'La nueva contraseña debe ser diferente a la anterior.',
  'New password should be different from the old password.': 'La nueva contraseña debe ser diferente a la anterior.',
  'Auth session missing': 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
  'Auth session missing!': 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',

  // Errores de OAuth
  'OAuth error': 'Error al conectar con Google. Intenta de nuevo.',

  // Errores genéricos
  'Network error': 'Error de conexión. Verifica tu internet.',
  'Request timeout': 'La solicitud tardó demasiado. Intenta de nuevo.',
};

export function translateAuthError(errorMessage: string): string {
  // Buscar coincidencia exacta
  if (AUTH_ERROR_MESSAGES[errorMessage]) {
    return AUTH_ERROR_MESSAGES[errorMessage];
  }

  // Buscar coincidencia parcial
  for (const [key, value] of Object.entries(AUTH_ERROR_MESSAGES)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return `Ha ocurrido un error: ${errorMessage}`;
}
