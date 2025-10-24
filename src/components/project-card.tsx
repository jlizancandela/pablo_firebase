
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import type { Project } from '@/lib/data';
import { Badge } from './ui/badge';
import { CalendarDays, MapPin, Trash2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { Button } from './ui/button';
import React from 'react';

/**
 * @typedef {import('@/lib/data').Project} Project
 */
interface ProjectCardProps {
  /**
   * El objeto del proyecto a mostrar.
   */
  project: Project;
  /**
   * Función callback que se ejecuta cuando se solicita la eliminación del proyecto.
   */
  onDelete: () => void;
}

/**
 * Formatea una fecha para mostrarla en la interfaz.
 * @param {any} date - La fecha a formatear (puede ser Timestamp de Firestore, Date de JS o string).
 * @returns {string} La fecha formateada como una cadena.
 */
function formatDate(date: any): string {
    if (!date) return '';
    if (date instanceof Timestamp) {
        return date.toDate().toLocaleDateString();
    }
    if (date instanceof Date) {
        return date.toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
}

/**
 * Componente que muestra una tarjeta con la información resumida de un proyecto.
 * Es un enlace a la página de detalles del proyecto y contiene un botón para eliminarlo.
 * @param {ProjectCardProps} props - Las propiedades del componente.
 * @returns {JSX.Element} La tarjeta del proyecto.
 */
export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
    /**
     * Maneja el evento de clic en el botón de eliminar, previniendo la navegación
     * y llamando a la función `onDelete`.
     * @param {React.MouseEvent<HTMLButtonElement>} e - El evento del ratón.
     */
    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete();
    };

  return (
    <Card className="hover:shadow-accent/20 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group">
      <Link href={`/projects/${project.id}`} className="block h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={project.coverPhotoUrl}
              alt={`Cover image for ${project.name}`}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint={project.coverPhotoHint}
            />
             <div className="absolute inset-0 bg-black/20 rounded-t-lg"></div>
              <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar proyecto</span>
              </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-grow">
          <h3 className="font-headline text-xl font-bold group-hover:text-primary transition-colors">{project.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
            <MapPin className="h-4 w-4 shrink-0" /> {project.address}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Cliente: {project.client}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
           <div className="flex items-center gap-2">
             <CalendarDays className="h-4 w-4" />
             <span>{formatDate(project.startDate)}</span>
           </div>
          <Badge variant={project.projectType === 'Comercial' ? 'default' : project.projectType === 'Residencial' ? 'secondary' : 'outline'}>{project.projectType}</Badge>
        </CardFooter>
      </Link>
    </Card>
  );
}
