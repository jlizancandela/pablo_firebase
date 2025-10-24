
import Image from 'next/image';
import type { Project } from '@/lib/data';
import { ListTodo, Camera, ClipboardList } from 'lucide-react';
import { Card, CardContent } from './ui/card';

/**
 * @typedef {import('@/lib/data').Project} Project
 */
interface ProjectHeaderProps {
  /**
   * El objeto del proyecto a mostrar en la cabecera.
   */
  project: Project;
}

/**
 * Componente que muestra la cabecera de la página de un proyecto.
 * Incluye la imagen de portada, nombre, dirección y estadísticas clave.
 * @param {ProjectHeaderProps} props - Las propiedades del componente.
 * @returns {JSX.Element} La cabecera del proyecto.
 */
export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const openTasks = project.tasks ? project.tasks.filter(t => !t.completed).length : 0;
  
  return (
    <div className="mt-8">
      <div className="relative h-64 w-full rounded-lg overflow-hidden">
        <Image
          src={project.coverPhotoUrl}
          alt={`Cover image for ${project.name}`}
          fill
          className="object-cover"
          data-ai-hint={project.coverPhotoHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl font-headline font-bold text-white">{project.name}</h1>
          <p className="text-lg text-neutral-200 mt-1">{project.address}</p>
          <p className="text-md text-neutral-300">Cliente: {project.client}</p>
        </div>
      </div>
      <Card className="-mt-12 mx-auto w-[95%] z-10 relative shadow-lg">
          <CardContent className="p-4 flex items-center justify-around">
            <div className="text-center">
                <ListTodo className="h-6 w-6 mx-auto text-primary"/>
                <p className="text-2xl font-bold">{openTasks}</p>
                <p className="text-sm text-muted-foreground">Tareas Abiertas</p>
            </div>
            <div className="text-center">
                <Camera className="h-6 w-6 mx-auto text-primary"/>
                <p className="text-2xl font-bold">{project.photos.length}</p>
                <p className="text-sm text-muted-foreground">Fotos</p>
            </div>
            <div className="text-center">
                <ClipboardList className="h-6 w-6 mx-auto text-primary"/>
                <p className="text-2xl font-bold">{project.visits.length}</p>
                <p className="text-sm text-muted-foreground">Visitas</p>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
