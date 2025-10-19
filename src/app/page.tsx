
'use client';

import Header from "@/components/header";
import ProjectCard from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import { useCollection, useFirebase, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { HardHat } from 'lucide-react';
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const { firestore, user } = useFirebase();

  const projectsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'projects'));
  }, [firestore, user]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  const handleCreateProject = () => {
    if (!user) return;
    const projectCollection = collection(firestore, 'users', user.uid, 'projects');
    
    const newProject: Omit<Project, 'id'> = {
      name: 'Nuevo Proyecto de Ejemplo',
      address: '123 Calle Falsa, Springfield',
      client: 'Cliente de Ejemplo',
      startDate: new Date(),
      projectType: 'Residencial',
      coverPhotoUrl: PlaceHolderImages[0].imageUrl,
      coverPhotoHint: PlaceHolderImages[0].imageHint,
      tasks: [],
      photos: [],
      visits: [],
      phases: [],
      files: [],
    };
    
    addDocumentNonBlocking(projectCollection, newProject);
  };


  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            Panel de Proyectos
          </h1>
          <Button onClick={handleCreateProject}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <p>Cargando proyectos...</p>
          </div>
        )}

        {!isLoading && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {!isLoading && (!projects || projects.length === 0) && (
           <Card className="flex flex-col items-center justify-center py-20 border-dashed">
             <HardHat className="h-12 w-12 text-muted-foreground mb-4" />
             <h3 className="text-xl font-semibold">No hay proyectos todavía</h3>
             <p className="text-muted-foreground">Crea tu primer proyecto para empezar a gestionar tu obra.</p>
             <Button className="mt-4" onClick={handleCreateProject}>
               <PlusCircle className="mr-2 h-4 w-4" />
               Crear Primer Proyecto
             </Button>
           </Card>
        )}
      </main>
    </div>
  );
}
