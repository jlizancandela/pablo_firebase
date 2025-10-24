
import * as admin from 'firebase-admin';

/**
 * Inicializa la aplicación de Firebase Admin de forma idempotente.
 * Comprueba si la aplicación ya está inicializada antes de intentar crear una nueva.
 * Esto es crucial en entornos sin servidor y de recarga en caliente para evitar errores.
 */
export const initializeAdminApp = () => {
  // Si ya hay una aplicación inicializada, la usamos y evitamos errores.
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Si no hay ninguna, la inicializamos con las credenciales de la aplicación por defecto
  // y la configuración del bucket de almacenamiento desde las variables de entorno.
  try {
    const app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    console.log('Firebase Admin SDK initialized successfully.');
    return app;
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Lanzamos el error para que la función que llama sepa que algo ha ido mal.
    throw new Error(`Firebase Admin SDK initialization failed: ${error.message}`);
  }
};
