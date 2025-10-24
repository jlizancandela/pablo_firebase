'use client';

import { useState } from 'react';
import { useToast } from './use-toast';
import { useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from 'firebase/storage';

/**
 * Hook para gestionar la subida de archivos directamente a Firebase Storage.
 * Proporciona el estado de la subida y una función para iniciarla.
 * @returns {{ uploadFile: (file: File) => Promise<string>, isUploading: boolean, uploadProgress: number }}
 * Un objeto con la función `uploadFile`, el estado `isUploading` y el `uploadProgress`.
 */
export const useFileUpload = () => {
  const { toast } = useToast();
  const storage = useStorage(); // Obtiene la instancia de Storage desde el contexto de Firebase.
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Sube un archivo a Firebase Storage.
   * @param {File} file - El archivo a subir.
   * @returns {Promise<string>} Una promesa que se resuelve con la URL de descarga del archivo.
   */
  const uploadFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Comprueba si el servicio de Storage está disponible.
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

      // Crea una referencia única para el archivo en Firebase Storage.
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);

      // Escucha los eventos de estado de la subida.
      uploadTask.on('state_changed',
        (snapshot) => {
          // Actualiza el progreso de la subida.
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          // Maneja los errores de subida.
          console.error("Error en la subida:", error);
          toast({
            variant: "destructive",
            title: "Error de subida",
            description: `No se pudo subir el archivo. Motivo: ${error.code}`,
          });
          setIsUploading(false);
          setUploadProgress(0);
          reject(error);
        },
        () => {
          // Maneja el éxito de la subida.
          setUploadProgress(100);
          // Una vez completada, obtiene la URL de descarga.
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          }).catch((error) => {
            console.error("Error obteniendo la URL de descarga:", error);
            toast({
              variant: "destructive",
              title: "Error de subida",
              description: "El archivo se subió, pero no se pudo obtener la URL.",
            });
            reject(error);
          }).finally(() => {
            // Se asegura de que el estado de subida se desactive al final.
            setIsUploading(false);
          });
        }
      );
    });
  };

  return { uploadFile, isUploading, uploadProgress };
};
