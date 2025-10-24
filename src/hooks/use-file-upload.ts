
'use client';

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useStorage } from '@/firebase';
import { useToast } from './use-toast';

/**
 * Hook para gestionar la subida de archivos a Firebase Storage.
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
      setUploadProgress(0); // Nota: uploadBytes no proporciona progreso. Se necesitaría uploadBytesResumable para eso.

      const storageRef = ref(storage, `${path}/${file.name}`);

      uploadBytes(storageRef, file)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              toast({
                title: 'Archivo subido',
                description: `El archivo ${file.name} se ha subido correctamente.`,
              });
              setIsUploading(false);
              resolve({ downloadURL, metadata: snapshot.metadata });
            })
            .catch((error) => {
              console.error('Error getting download URL:', error);
              toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo obtener la URL del archivo.',
              });
              setIsUploading(false);
              reject(error);
            });
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          toast({
            variant: 'destructive',
            title: 'Error de subida',
            description: `No se pudo subir el archivo ${file.name}.`,
          });
          setIsUploading(false);
          reject(error);
        });
    });
  };

  return { uploadFile, isUploading, uploadProgress };
};
