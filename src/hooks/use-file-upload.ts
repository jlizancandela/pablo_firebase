'use client';

import { useState } from 'react';
import { useToast } from './use-toast';
import { useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from 'firebase/storage';

/**
 * Hook para gestionar la subida de archivos directamente a Firebase Storage.
 * Proporciona el estado de la subida y una función para iniciarla.
 * @returns {{ uploadFile: (file: File) => Promise<{ downloadURL: string }>, isUploading: boolean, uploadProgress: number }}
 * Un objeto con la función `uploadFile`, el estado `isUploading` y el `uploadProgress`.
 */
export const useFileUpload = () => {
  const { toast } = useToast();
  const storage = useStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Sube un archivo a Firebase Storage.
   * @param {File} file - El archivo a subir.
   * @returns {Promise<{ downloadURL: string }>} Una promesa que se resuelve con la URL de descarga del archivo.
   */
  const uploadFile = (file: File): Promise<{ downloadURL: string }> => {
    return new Promise((resolve, reject) => {
      if (!storage) {
        const error = new Error("Firebase Storage no está inicializado.");
        toast({
          variant: "destructive",
          title: "Error de configuración",
          description: error.message,
        });
        return reject(error);
      }

      setIsUploading(true);
      setUploadProgress(0);

      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Seguir el progreso de la subida
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          // Manejar errores de subida
          setIsUploading(false);
          setUploadProgress(0);
          console.error("Error en la subida:", error);
          toast({
            variant: "destructive",
            title: "Error de subida",
            description: "No se pudo subir el archivo. Comprueba la configuración de CORS de tu bucket.",
          });
          reject(error);
        },
        () => {
          // Manejar el éxito de la subida
          setUploadProgress(100);
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setIsUploading(false);
            resolve({ downloadURL });
          }).catch((error) => {
            setIsUploading(false);
            console.error("Error obteniendo la URL de descarga:", error);
            toast({
              variant: "destructive",
              title: "Error de subida",
              description: "El archivo se subió pero no se pudo obtener la URL.",
            });
            reject(error);
          });
        }
      );
    });
  };

  return { uploadFile, isUploading, uploadProgress };
};
