
'use client';

import { useState } from 'react';
import { useToast } from './use-toast';

/**
 * Hook para gestionar la subida de archivos a un endpoint de API propio.
 * Proporciona el estado de la subida y una función para iniciarla.
 * @returns {{ uploadFile: (file: File) => Promise<{ downloadURL: string }>, isUploading: boolean, uploadProgress: number }}
 * Un objeto con la función `uploadFile`, el estado `isUploading` y el `uploadProgress`.
 */
export const useFileUpload = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Sube un archivo a través del endpoint de la API /api/upload.
   * @param {File} file - El archivo a subir.
   * @returns {Promise<{ downloadURL: string }>} Una promesa que se resuelve con la URL de descarga del archivo.
   */
  const uploadFile = (
    file: File
  ): Promise<{ downloadURL: string }> => {
    return new Promise((resolve, reject) => {
      setIsUploading(true);
      setUploadProgress(0);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);

      // Seguir el progreso de la subida
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      // Manejar el éxito de la subida
      xhr.onload = () => {
        setUploadProgress(100);
        setIsUploading(false);
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({ downloadURL: response.downloadURL });
          } catch (error) {
             toast({
              variant: 'destructive',
              title: 'Error de subida',
              description: 'La respuesta del servidor no es válida.',
            });
            reject(new Error('Invalid JSON response from server.'));
          }
        } else {
          const errorText = xhr.responseText || 'No se pudo subir el archivo.';
          toast({
            variant: 'destructive',
            title: 'Error de subida',
            description: errorText,
          });
          reject(new Error(errorText));
        }
      };

      // Manejar errores de red
      xhr.onerror = () => {
        setIsUploading(false);
        setUploadProgress(0);
        const errorText = 'Error de red al intentar subir el archivo.';
        toast({
          variant: 'destructive',
          title: 'Error de red',
          description: errorText,
        });
        reject(new Error(errorText));
      };

      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    });
  };

  return { uploadFile, isUploading, uploadProgress };
};
