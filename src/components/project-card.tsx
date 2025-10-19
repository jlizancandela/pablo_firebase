import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import type { Project } from '@/lib/data';
import { Badge } from './ui/badge';
import { CalendarDays, MapPin } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="block h-full">
      <Card className="hover:shadow-accent/20 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group">
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
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-grow">
          <h3 className="font-headline text-xl font-bold group-hover:text-primary transition-colors">{project.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
            <MapPin className="h-4 w-4 shrink-0" /> {project.address}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Client: {project.client}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
           <div className="flex items-center gap-2">
             <CalendarDays className="h-4 w-4" />
             <span>{project.startDate.toLocaleDateString()}</span>
           </div>
          <Badge variant={project.projectType === 'Commercial' ? 'default' : project.projectType === 'Residential' ? 'secondary' : 'outline'}>{project.projectType}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
