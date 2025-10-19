import Image from 'next/image';
import type { Project } from '@/lib/data';
import { Button } from './ui/button';
import { Download, Upload, ListTodo, Camera, ClipboardList } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
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
          <p className="text-md text-neutral-300">Client: {project.client}</p>
        </div>
      </div>
      <Card className="-mt-12 mx-auto w-[95%] z-10 relative shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex-1 flex justify-around">
                <div className="text-center">
                    <ListTodo className="h-6 w-6 mx-auto text-primary"/>
                    <p className="text-2xl font-bold">{project.tasks.filter(t => !t.completed).length}</p>
                    <p className="text-sm text-muted-foreground">Open Tasks</p>
                </div>
                <div className="text-center">
                    <Camera className="h-6 w-6 mx-auto text-primary"/>
                    <p className="text-2xl font-bold">{project.photos.length}</p>
                    <p className="text-sm text-muted-foreground">Photos</p>
                </div>
                <div className="text-center">
                    <ClipboardList className="h-6 w-6 mx-auto text-primary"/>
                    <p className="text-2xl font-bold">{project.visits.length}</p>
                    <p className="text-sm text-muted-foreground">Visits</p>
                </div>
            </div>
            <Separator orientation="vertical" className="h-16 mx-4" />
            <div className="flex flex-col gap-2">
               <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> Import Data</Button>
               <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export Data</Button>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
