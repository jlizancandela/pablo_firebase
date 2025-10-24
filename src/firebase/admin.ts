
import * as admin from 'firebase-admin';

// Evitar la reinicialización en entornos de desarrollo con hot-reloading
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    console.log('Firebase Admin SDK initialized.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
  }
}

export const adminApp = admin.apps[0];

export const initializeAdminApp = async () => {
  // Esta función ahora simplemente se asegura de que la inicialización ya ocurrió.
  if (!admin.apps.length) {
    console.error("Firebase Admin SDK no se inicializó correctamente al arrancar.");
  }
};
