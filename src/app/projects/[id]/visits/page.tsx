
'use client';

import { useProject } from "../project-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CalendarDays, Users, ClipboardList, Edit, Calendar as CalendarIcon } from "lucide-react";
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
import { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import type { Visit } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const visitSchema = z.object({
  date: z.date({
    required_error: "La fecha es obligatoria.",
  }),
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
  const [visitToEdit, setVisitToEdit] = useState<Visit | null>(null);
  const { toast } = useToast();

   const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      date: new Date(),
      phase: "",
      attendees: "",
      observations: "",
    },
  });
  
   useEffect(() => {
    if (visitToEdit) {
      setValue("date", new Date(visitToEdit.date));
      setValue("phase", visitToEdit.phase);
      setValue("attendees", visitToEdit.attendees.join(', '));
      setValue("observations", visitToEdit.observations);
    } else {
      reset({
        date: new Date(),
        phase: "",
        attendees: "",
        observations: "",
      });
    }
  }, [visitToEdit, setValue, reset]);

  const handleOpenDialog = (visit: Visit | null) => {
    setVisitToEdit(visit);
    setOpen(true);
  };

  const onSubmit = async (data: VisitFormData) => {
    try {
        const currentProject = await db.projects.get(project.id);
        if (!currentProject) throw new Error("Project not found");

        let updatedVisits: Visit[];
        
        if (visitToEdit) { // Editing existing visit
            updatedVisits = currentProject.visits.map(v => 
                v.id === visitToEdit.id ? { ...v, ...data, attendees: data.attendees.split(',').map(n => n.trim()) } : v
            );
            toast({ title: "Visita actualizada", description: "Los cambios en la visita han sido guardados." });
        } else { // Creating new visit
            const newVisit: Visit = {
              id: uuidv4(),
              ...data,
              attendees: data.attendees.split(',').map(name => name.trim()).filter(name => name),
            };
            updatedVisits = [...currentProject.visits, newVisit];
            toast({ title: "Visita registrada", description: "La nueva visita ha sido añadida al proyecto."});
        }
      
        await db.projects.update(project.id, { visits: updatedVisits });
        reset();
        setOpen(false);
        setVisitToEdit(null);
    } catch (error) {
      console.error("Error saving visit: ", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar la visita."});
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold">Registro de Visitas</h2>
        <Button onClick={() => handleOpenDialog(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Nueva Visita
        </Button>
      </div>

       <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) setVisitToEdit(null); }}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>{visitToEdit ? 'Editar Visita' : 'Registrar Nueva Visita'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">

                 <div className="space-y-2">
                  <Label htmlFor="date">Fecha de la visita</Label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
                </div>

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

      {project.visits.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 border-dashed">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Hay Visitas Registradas</h3>
            <p className="text-muted-foreground">Registra las visitas a obra para mantener un historial de actividades.</p>
             <Button className="mt-4" onClick={() => handleOpenDialog(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Primera Visita
            </Button>
          </Card>
        ) : (
        <div className="space-y-4">
          {[...project.visits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((visit) => (
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
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(visit)}>
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
