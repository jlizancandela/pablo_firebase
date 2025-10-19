'use client';
import { AppStore, makeStore } from '@/lib/store';
import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { FirebaseProvider, initializeFirebase } from '.';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  const { firebaseApp, firestore, auth } = initializeFirebase();

  return (
    <Provider store={storeRef.current}>
      <FirebaseProvider
        firebaseApp={firebaseApp}
        auth={auth}
        firestore={firestore}
      >
        {children}
      </FirebaseProvider>
    </Provider>
  );
}
