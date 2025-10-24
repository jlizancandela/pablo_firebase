
'use client';

import { useProject } from "../layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CalendarDays, Users, ClipboardList, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import type { Visit } from "@/lib/data";

const visitSchema = z.object({
  phase: z.string().min(1, "La fase es obligatoria."),
  attendees: z.string().min(1, "Debe haber al menos un asistente."),
  observations: z.string().min(1, "Las observaciones son obligatorias."),
});

type VisitFormData = z.infer<typeof visitSchema>;


/**
 * Formatea una fecha para mostrarla en un formato largo y legible.
 * @param {Date} date - La fecha a formatear.
 * @returns {string} La fecha formateada, ej: "19 de octubre de 2025".
 */
function formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Página que muestra el registro de visitas a obra de un proyecto.
 * @returns {JSX.Element} El componente de la página de registro de visitas.
 */
export default function ProjectVisitsPage() {
  const project = useProject();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

   const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      phase: "",
      attendees: "",
      observations: "",
    },
  });

  const onSubmit = async (data: VisitFormData) => {
    const newVisit: Visit = {
      id: uuidv4(),
      date: new Date(),
      phase: data.phase,
      attendees: data.attendees.split(',').map(name => name.trim()).filter(name => name),
      observations: data.observations,
    };

    try {
        const currentProject = await db.projects.get(project.id);
        if (currentProject) {
            const updatedVisits = [...currentProject.visits, newVisit];
            await db.projects.update(project.id, { visits: updatedVisits });
        }
      reset();
      setOpen(false);
      toast({ title: "Visita registrada", description: "La nueva visita ha sido añadida al proyecto."});
    } catch (error) {
      console.error("Error adding visit: ", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo añadir la visita."});
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold">Registro de Visitas</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Nueva Visita
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Registrar nueva visita</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="phase">Fase Actual</Label>
                  <Controller name="phase" control={control} render={({ field }) => <Input id="phase" {...field} placeholder="Ej: Estructura, Acabados..." />} />
                  {errors.phase && <p className="text-red-500 text-xs">{errors.phase.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attendees">Asistentes</Label>
                  <Controller name="attendees" control={control} render={({ field }) => <Input id="attendees" {...field} placeholder="Nombres separados por comas"/>} />
                   <p className="text-xs text-muted-foreground">Separa los nombres de los asistentes con comas.</p>
                  {errors.attendees && <p className="text-red-500 text-xs">{errors.attendees.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observations">Observaciones</Label>
                   <Controller
                    name="observations"
                    control={control}
                    render={({ field }) => (
                      <Textarea id="observations" {...field} className="min-h-[120px]" placeholder="Detalla aquí los puntos clave, decisiones y próximos pasos..." />
                    )}
                  />
                  {errors.observations && <p className="text-red-500 text-xs">{errors.observations.message}</p>}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Guardar Visita</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {project.visits.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 border-dashed">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Hay Visitas Registradas</h3>
            <p className="text-muted-foreground">Registra las visitas a obra para mantener un historial de actividades.</p>
             <Button className="mt-4" onClick={() => setOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Primera Visita
            </Button>
          </Card>
        ) : (
        <div className="space-y-4">
          {[...project.visits].sort((a, b) => b.date.getTime() - a.date.getTime()).map((visit) => (
            <Card key={visit.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                       <CalendarDays className="h-5 w-5 text-muted-foreground"/> 
                       <span className="font-sans">{formatDate(visit.date)}</span>
                    </CardTitle>
                    <CardDescription className="mt-1 ml-8">Fase: <Badge variant="secondary">{visit.phase}</Badge></CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => alert("La edición de visitas se implementará en una futura versión.")}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar Visita</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-2">
                        <h4 className="font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-muted-foreground"/>Asistentes</h4>
                        <div className="flex flex-wrap gap-1">
                            {visit.attendees.map(attendee => <Badge key={attendee} variant="outline">{attendee}</Badge>)}
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <h4 className="font-semibold flex items-center gap-2"><ClipboardList className="h-5 w-5 text-muted-foreground"/>Observaciones</h4>
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{visit.observations}</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
