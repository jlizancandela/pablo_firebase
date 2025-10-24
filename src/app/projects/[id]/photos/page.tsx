
'use client';

import Image from "next/image";
import { useProject } from "../layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, PlusCircle, Trash2, Save, Upload } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import type { Photo } from "@/lib/data";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { useLiveQuery } from "dexie-react-hooks";

const fileToUrl = (file: File | Blob): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });
};

/**
 * Página que muestra la galería de fotos de un proyecto.
 * Permite añadir nuevas fotos y ver las existentes.
 * @returns {JSX.Element} El componente de la página de galería de fotos.
 */
export default function ProjectPhotosPage() {
  const project = useProject();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [photoComments, setPhotoComments] = useState<Record<string, string>>({});
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  
  // Create a live query for just the photos of the current project
  const photos = useLiveQuery(async () => {
    const proj = await db.projects.get(project.id);
    return proj?.photos || [];
  }, [project.id]);

  /**
   * Maneja la selección de un archivo para subirlo.
   * @param {React.ChangeEvent<HTMLInputElement>} event - El evento de cambio del input de archivo.
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast({
      title: 'Procesando foto',
      description: `Añadiendo ${file.name}...`,
    });

    try {
      const imageUrl = await fileToUrl(file);

      const newPhoto: Photo = {
        id: uuidv4(),
        url: imageUrl,
        hint: 'local photo', // Hint for local images
        comment: '',
        capturedAt: new Date(),
      };
      
      const currentProject = await db.projects.get(project.id);
      if (currentProject) {
        const updatedPhotos = [...currentProject.photos, newPhoto];
        await db.projects.update(project.id, { photos: updatedPhotos });
      }

      toast({
        title: '¡Foto añadida!',
        description: 'La foto se ha guardado en la base de datos local.',
      });
    } catch (error) {
      console.error("Error guardando la foto: ", error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudo guardar la foto.';
      toast({
        variant: "destructive",
        title: 'Error',
        description: `No se pudo guardar la foto. Razón: ${errorMessage}`,
      });
    }
  };
  
  /**
   * Maneja el cambio en el campo de comentario de una foto.
   * @param {string} photoId - El ID de la foto que se está comentando.
   * @param {string} text - El texto del comentario.
   */
  const handleCommentChange = (photoId: string, text: string) => {
    setPhotoComments(prev => ({ ...prev, [photoId]: text }));
  };

  /**
   * Guarda el comentario de una foto en la base de datos.
   * @param {string} photoId - El ID de la foto cuyo comentario se va a guardar.
   */
  const handleSaveComment = async (photoId: string) => {
    const updatedPhotos = project.photos.map(p => 
      p.id === photoId ? { ...p, comment: photoComments[photoId] ?? p.comment } : p
    );

    await db.projects.update(project.id, { photos: updatedPhotos });
    
    toast({
      title: 'Comentario guardado',
      description: 'El comentario de la foto ha sido actualizado.',
    });
  };

  /**
   * Elimina una foto del proyecto.
   */
  const handleDeletePhoto = async () => {
    if (!photoToDelete || !photos) return;
    
    const updatedPhotos = photos.filter(p => p.id !== photoToDelete.id);
    await db.projects.update(project.id, { photos: updatedPhotos });

    toast({
      title: 'Foto eliminada',
      description: 'La foto ha sido eliminada del proyecto.',
    });
    setPhotoToDelete(null);
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold">Galería de Fotos</h2>
        <Button 
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Foto
        </Button>
      </div>

      {photos === undefined ? (
        <p>Cargando fotos...</p>
      ) : photos.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 border-dashed">
          <Camera className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Aún no hay fotos</h3>
          <p className="text-muted-foreground">Añade fotos para documentar el progreso del proyecto.</p>
          <Button className="mt-4" onClick={() => fileInputRef.current?.click()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Primera Foto
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <Card key={photo.id} className="group overflow-hidden flex flex-col">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo.url}
                    alt={photo.comment || "Foto del proyecto"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={photo.hint}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => setPhotoToDelete(photo)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar foto</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-3 bg-card flex-grow flex-col items-start gap-2">
                <Textarea
                  placeholder="Añade un comentario..."
                  value={photoComments[photo.id] ?? photo.comment ?? ''}
                  onChange={(e) => handleCommentChange(photo.id, e.target.value)}
                  className="text-sm h-16"
                />
                {(photoComments[photo.id] !== undefined && photoComments[photo.id] !== (photo.comment ?? '')) && (
                  <Button size="sm" className="w-full" onClick={() => handleSaveComment(photo.id)}>
                    <Save className="mr-2 h-4 w-4"/> Guardar comentario
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es permanente y no se puede deshacer. Se eliminará la foto seleccionada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPhotoToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePhoto}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
