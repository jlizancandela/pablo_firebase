
'use client';

import { useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type WorkLog, type ProjectWithId } from "@/lib/data";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";

// Define the schema for the work log form
const workLogSchema = z.object({
  projectId: z.string().min(1, "Debes seleccionar una obra."),
  date: z.date({ required_error: "La fecha es obligatoria." }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)."),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)."),
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

interface WorkLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logToEdit: WorkLog | null;
  onSubmit: (data: WorkLogFormData) => void;
  projects: ProjectWithId[] | undefined;
}

export default function WorkLogDialog({ open, onOpenChange, logToEdit, onSubmit, projects }: WorkLogDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WorkLogFormData>({
    resolver: zodResolver(workLogSchema),
  });

  // Reset form when dialog opens/closes or logToEdit changes
  useEffect(() => {
    if (open) {
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
    }
  }, [open, logToEdit, setValue, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
}
