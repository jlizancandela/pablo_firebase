
'use client';

import Header from "@/components/header";
import ProjectCard from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import { Card } from '@/components/ui/card';
import { HardHat } from 'lucide-react';
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db, ProjectWithId } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useToast } from "@/hooks/use-toast";

const projectSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  address: z.string().min(1, "La dirección es obligatoria."),
  client: z.string().min(1, "El cliente es obligatorio."),
  projectType: z.enum(["Comercial", "Residencial", "Industrial"]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

/**
 * Página principal que muestra el panel de proyectos.
 * Permite a los usuarios ver sus proyectos existentes, crear nuevos proyectos y eliminarlos.
 * @returns {JSX.Element} El componente de la página de inicio.
 */
export default function Home() {
  const [open, setOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectWithId | null>(null);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      address: "",
      client: "",
      projectType: "Residencial",
    },
  });

  const projects = useLiveQuery(() => db.projects.toArray(), []);

  /**
   * Maneja el envío del formulario para crear un nuevo proyecto.
   * @param {ProjectFormData} data - Los datos del formulario del proyecto.
   */
  const onSubmit = async (data: ProjectFormData) => {
    try {
      await db.addProject(data);
      toast({
        title: "Proyecto creado",
        description: `El proyecto "${data.name}" ha sido creado con éxito.`
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el proyecto."
      });
    }
  };
  
  /**
   * Maneja la eliminación de un proyecto después de la confirmación.
   */
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await db.projects.delete(projectToDelete.id);
      toast({
        title: "Proyecto eliminado",
        description: `El proyecto "${projectToDelete.name}" ha sido eliminado.`
      });
      setProjectToDelete(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el proyecto."
      });
    }
  };

  /**
   * Componente que renderiza el botón y el diálogo para crear un nuevo proyecto.
   * @param {object} props - Propiedades del componente.
   * @param {boolean} [props.isCard] - Si es `true`, renderiza el botón en una tarjeta de placeholder.
   * @returns {JSX.Element} El botón y el diálogo de creación de proyecto.
   */
  const CreateProjectButton = ({ isCard }: { isCard?: boolean }) => (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isCard ? (
          <Button className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Primer Proyecto
          </Button>
        ) : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo proyecto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-2">
              <Label htmlFor="name" className="text-left sm:text-right">Nombre</Label>
              <Controller name="name" control={control} render={({ field }) => <Input id="name" {...field} className="col-span-full sm:col-span-3" />} />
              {errors.name && <p className="col-span-full sm:col-span-4 text-red-500 text-xs sm:text-right">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-2">
              <Label htmlFor="address" className="text-left sm:text-right">Dirección</Label>
              <Controller name="address" control={control} render={({ field }) => <Input id="address" {...field} className="col-span-full sm:col-span-3" />} />
              {errors.address && <p className="col-span-full sm:col-span-4 text-red-500 text-xs sm:text-right">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-2">
              <Label htmlFor="client" className="text-left sm:text-right">Cliente</Label>
              <Controller name="client" control={control} render={({ field }) => <Input id="client" {...field} className="col-span-full sm:col-span-3" />} />
              {errors.client && <p className="col-span-full sm:col-span-4 text-red-500 text-xs sm:text-right">{errors.client.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-2">
              <Label htmlFor="projectType" className="text-left sm:text-right">Tipo</Label>
              <Controller name="projectType" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="col-span-full sm:col-span-3">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residencial">Residencial</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
            <Button type="submit">Crear Proyecto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            Panel de Proyectos
          </h1>
          {projects && projects.length > 0 && <CreateProjectButton />}
        </div>

        {projects === undefined && (
          <div className="text-center py-20">
            <p>Cargando proyectos...</p>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onDelete={() => setProjectToDelete(project)}
                priority={index === 0} // Solo la primera imagen tendrá prioridad
              />
            ))}
          </div>
        )}

        {projects && projects.length === 0 && (
           <Card className="flex flex-col items-center justify-center py-20 border-dashed">
             <HardHat className="h-12 w-12 text-muted-foreground mb-4" />
             <h3 className="text-xl font-semibold">No hay proyectos todavía</h3>
             <p className="text-muted-foreground">Crea tu primer proyecto para empezar a gestionar tu obra.</p>
             <CreateProjectButton isCard={true} />
           </Card>
        )}
      </main>

       <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es permanente y no se puede deshacer. Se eliminará el proyecto
              <span className="font-semibold"> {projectToDelete?.name}</span> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
