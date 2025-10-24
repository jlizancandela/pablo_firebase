
'use client';

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot } from 'firebase/storage';
import { useStorage } from '@/firebase';
import { useToast } from './use-toast';

/**
 * Hook para gestionar la subida de archivos a Firebase Storage con seguimiento de progreso.
 * Proporciona el estado de la subida y una función para iniciarla.
 * @returns {{ uploadFile: (file: File, path: string) => Promise<{ downloadURL: string; metadata: any }>, isUploading: boolean, uploadProgress: number }}
 * Un objeto con la función `uploadFile`, el estado `isUploading` y el `uploadProgress`.
 */
export const useFileUpload = () => {
  const storage = useStorage();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Sube un archivo a una ruta específica en Firebase Storage.
   * @param {File} file - El archivo a subir.
   * @param {string} path - La ruta en Storage donde se guardará el archivo.
   * @returns {Promise<{ downloadURL: string; metadata: any }>} Una promesa que se resuelve con la URL de descarga y los metadatos del archivo.
   */
  const uploadFile = (
    file: File,
    path: string
  ): Promise<{ downloadURL: string; metadata: any }> => {
    return new Promise((resolve, reject) => {
      setIsUploading(true);
      setUploadProgress(0);

      const storageRef = ref(storage, `${path}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
          toast({
            variant: 'destructive',
            title: 'Error de subida',
            description: `No se pudo subir el archivo ${file.name}.`,
          });
          setIsUploading(false);
          setUploadProgress(0);
          reject(error);
        },
        () => {
          // Subida completada con éxito
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setUploadProgress(100); // Asegurar que la barra llega al 100%
              toast({
                title: 'Archivo subido',
                description: `El archivo ${file.name} se ha subido correctamente.`,
              });
              resolve({ downloadURL, metadata: uploadTask.snapshot.metadata });
            })
            .catch((error) => {
              console.error('Error getting download URL:', error);
              toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo obtener la URL del archivo.',
              });
              reject(error);
            })
            .finally(() => {
              setIsUploading(false);
            });
        }
      );
    });
  };

  return { uploadFile, isUploading, uploadProgress };
};
