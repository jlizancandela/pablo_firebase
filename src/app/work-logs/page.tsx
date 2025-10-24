
'use client';

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Calendar as CalendarIcon, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { type WorkLog, type ProjectWithId } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { cn } from "@/lib/utils";
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

// Define the schema for the work log form
const workLogSchema = z.object({
  projectId: z.string().min(1, "Debes seleccionar una obra."),
  date: z.date({ required_error: "La fecha es obligatoria." }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)."),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0*5][0-9]$/, "Formato de hora inválido (HH:mm)."),
  description: z.string().min(1, "La descripción es obligatoria."),
}).refine(data => {
    const start = parse(data.startTime, 'HH:mm', new Date());
    const end = parse(data.endTime, 'HH:mm', new Date());
    return end > start;
}, {
    message: "La hora de finalización debe ser posterior a la de inicio.",
    path: ["endTime"],
});

type WorkLogFormData = z.infer<typeof workLogSchema>;

/**
 * Calculates the difference between two times in HH:mm format.
 * @param {string} startTime - The start time, e.g., "09:00".
 * @param {string} endTime - The end time, e.g., "17:30".
 * @returns {string} The duration in hours and minutes, e.g., "8h 30m".
 */
const calculateDuration = (startTime: string, endTime: string): string => {
  try {
    const start = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());
    const diffMs = end.getTime() - start.getTime();

    if (diffMs < 0) return "N/A";

    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  } catch (e) {
    return "N/A";
  }
};


export default function WorkLogsPage() {
  const [open, setOpen] = useState(false);
  const [logToEdit, setLogToEdit] = useState<WorkLog | null>(null);
  const { toast } = useToast();

  const projects = useLiveQuery(() => db.projects.toArray(), []);
  const workLogs = useLiveQuery(() => db.workLogs.orderBy('date').reverse().toArray(), []);

  const projectMap = useMemo(() => {
    if (!projects) return new Map();
    return new Map(projects.map(p => [p.id, p.name]));
  }, [projects]);
  
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WorkLogFormData>({
    resolver: zodResolver(workLogSchema),
  });

  useEffect(() => {
    if (logToEdit) {
      setValue("projectId", logToEdit.projectId);
      setValue("date", new Date(logToEdit.date));
      setValue("startTime", logToEdit.startTime);
      setValue("endTime", logToEdit.endTime);
      setValue("description", logToEdit.description);
    } else {
      reset({
        projectId: "",
        date: new Date(),
        startTime: "",
        endTime: "",
        description: "",
      });
    }
  }, [logToEdit, setValue, reset]);


  const handleOpenDialog = (log: WorkLog | null) => {
    setLogToEdit(log);
    setOpen(true);
  };

  const onSubmit = async (data: WorkLogFormData) => {
    try {
      if (logToEdit) { // Editing existing log
        await db.workLogs.update(logToEdit.id, data);
        toast({ title: "Registro actualizado", description: "El registro de horas ha sido guardado." });
      } else { // Creating new log
        const newLog: WorkLog = {
          id: uuidv4(),
          ...data,
        };
        await db.workLogs.add(newLog);
        toast({ title: "Registro añadido", description: "Las horas de trabajo han sido guardadas." });
      }
      reset();
      setOpen(false);
      setLogToEdit(null);
    } catch (error) {
      console.error("Error saving work log: ", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar el registro." });
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            Registro de Horas
          </h1>
          <Button onClick={() => handleOpenDialog(null)} disabled={!projects || projects.length === 0}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Registro
          </Button>
        </div>

        {/* Form Dialog */}
        <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) setLogToEdit(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{logToEdit ? 'Editar Registro' : 'Añadir Nuevo Registro'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="projectId">Obra</Label>
                  <Controller
                    name="projectId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una obra..." />
                        </SelectTrigger>
                        <SelectContent>
                          {projects?.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.projectId && <p className="text-red-500 text-xs">{errors.projectId.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                   <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label htmlFor="startTime">Hora Inicio</Label>
                    <Controller name="startTime" control={control} render={({ field }) => <Input id="startTime" type="time" {...field} />} />
                    {errors.startTime && <p className="text-red-500 text-xs">{errors.startTime.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Hora Fin</Label>
                    <Controller name="endTime" control={control} render={({ field }) => <Input id="endTime" type="time" {...field} />} />
                    {errors.endTime && <p className="text-red-500 text-xs">{errors.endTime.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción de la Actividad</Label>
                  <Controller name="description" control={control} render={({ field }) => <Textarea id="description" {...field} placeholder="Ej: Replanteo de tabiquería en planta 1..." />} />
                  {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>


        <Card>
          <CardContent className="p-0">
             <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Obra</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-center">Horas</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workLogs === undefined && (
                     <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">Cargando registros...</TableCell>
                    </TableRow>
                  )}
                  {workLogs && workLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">No hay registros de horas todavía.</TableCell>
                    </TableRow>
                  )}
                  {workLogs?.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(new Date(log.date), "dd MMM yyyy", { locale: es })}
                      </TableCell>
                       <TableCell>{projectMap.get(log.projectId) ?? 'Obra no encontrada'}</TableCell>
                      <TableCell className="max-w-sm truncate">{log.description}</TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {calculateDuration(log.startTime, log.endTime)}
                        </div>
                      </TableCell>
                       <TableCell className="text-right">
                         <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(log)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar Registro</span>
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
