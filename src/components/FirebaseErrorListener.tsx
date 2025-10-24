
'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Componente invisible que escucha eventos 'permission-error' emitidos globalmente.
 * Lanza cualquier error recibido para que sea capturado por el `global-error.tsx` de Next.js.
 * @returns {null} Este componente no renderiza nada.
 */
export function FirebaseErrorListener() {
  // Usar el tipo de error específico para el estado para mayor seguridad de tipos.
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    // El callback ahora espera un error fuertemente tipado, que coincide con el payload del evento.
    const handleError = (error: FirestorePermissionError) => {
      // Establecer el error en el estado para activar una nueva renderización.
      setError(error);
    };

    // El emisor tipado forzará que el callback para 'permission-error'
    // coincida con el tipo de payload esperado (FirestorePermissionError).
    errorEmitter.on('permission-error', handleError);

    // Desuscribirse al desmontar para evitar fugas de memoria.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // En una nueva renderización, si existe un error en el estado, lo lanza.
  if (error) {
    throw error;
  }

  // Este componente no renderiza nada.
  return null;
}
