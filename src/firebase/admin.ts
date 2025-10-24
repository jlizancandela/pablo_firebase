
import { getApps, initializeApp, getApp, type App } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as admin from 'firebase-admin';

/**
 * Inicializa la aplicación de Firebase Admin de forma idempotente.
 * Comprueba si la aplicación ya está inicializada antes de intentar crear una nueva.
 * Utiliza importaciones modulares para ser compatible con bundlers modernos como Turbopack.
 * @returns {App} La instancia de la aplicación de Firebase Admin.
 */
export const initializeAdminApp = (): App => {
  // Si ya hay una aplicación inicializada con el nombre por defecto, la devolvemos.
  if (getApps().length > 0) {
    return getApp();
  }

  // Si no, la inicializamos.
  try {
    const app = initializeApp({
      // Las credenciales de `applicationDefault` son detectadas automáticamente
      // por el entorno de Google Cloud.
      credential: admin.credential.applicationDefault(),
      // Leemos el bucket de almacenamiento desde las variables de entorno.
      // ESTA LÍNEA ES CRUCIAL para que el SDK de Admin sepa a qué bucket conectarse.
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    console.log('Firebase Admin SDK initialized successfully.');
    return app;
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error);
    // Relanzamos un error más claro para facilitar la depuración.
    throw new Error(`Firebase Admin SDK initialization failed: ${error.message}`);
  }
};
