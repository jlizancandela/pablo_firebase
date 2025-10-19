
'use client';

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useStorage } from '@/firebase';
import { useToast } from './use-toast';

export const useFileUpload = () => {
  const storage = useStorage();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = (
    file: File,
    path: string
  ): Promise<{ downloadURL: string; metadata: any }> => {
    return new Promise((resolve, reject) => {
      setIsUploading(true);
      setUploadProgress(0);

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
