
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

/**
 * Función ÚNICA y CENTRALIZADA para obtener las instancias de Firebase.
 * Se asegura de que la inicialización solo ocurra una vez (idempotente).
 * @returns {{ firebaseApp: FirebaseApp, auth: Auth, firestore: Firestore, storage: FirebaseStorage }}
 */
export function initializeFirebase() {
  let app: FirebaseApp;

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  
  return {
    firebaseApp: app,
    auth,
    firestore,
    storage,
  };
}

// --- Exportaciones de utilidades y hooks ---

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
