'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { errorEmitter } from '@/firebase/error-emitter';
import { useEffect, useState } from 'react';

export function FirebaseErrorListener() {
  const [permissionError, setPermissionError] = useState<any>();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      setPermissionError(error);
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return (
    <>
      {permissionError && (
        <AlertDialog open={!!permissionError}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Firestore Security Rules Error
              </AlertDialogTitle>
              <AlertDialogDescription>
                <p>
                  Your request to access a Firestore resource was denied. Check
                  your rules to ensure the request is allowed.
                </p>
                <pre className="mt-2 w-full overflow-auto rounded-md bg-slate-950 p-4 text-white">
                  {JSON.stringify(permissionError.cause.context, null, 2)}
                </pre>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setPermissionError(undefined)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
