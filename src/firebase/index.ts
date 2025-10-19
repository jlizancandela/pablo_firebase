import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export * from './provider';

const APPS_NAMES = {
  CLIENT_APP: 'CLIENT_APP',
};

export function initializeFirebase() {
  const apps = getApps();
  const clientApp = apps.find((app) => app.name === APPS_NAMES.CLIENT_APP);

  if (clientApp) {
    const firebaseApp = clientApp;
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);
    return { firebaseApp, auth, firestore };
  } else {
    const firebaseApp = initializeApp(firebaseConfig, APPS_NAMES.CLIENT_APP);
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);

    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
        disableWarnings: true,
      });
      connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    }
    return { firebaseApp, auth, firestore };
  }
}
