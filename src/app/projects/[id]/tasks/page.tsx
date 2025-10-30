
"use client";

import { useState } from "react";
import { useProject } from "../project-context";
import { Task } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils";
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
  AlertDialogTrigger,
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
import { db } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

const taskSchema = z.object({
  description: z.string().min(1, "La descripción es obligatoria."),
  assigneeName: z.string().min(1, "El nombre del asignado es obligatorio."),
  priority: z.enum(["Alta", "Media", "Baja"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

/**
 * Página para mostrar y gestionar las tareas de un proyecto.
 * Permite crear nuevas tareas y marcar las existentes como completadas.
 * @returns {JSX.Element} El componente de la página de tareas.
 */
export default function ProjectTasksPage() {
  const project = useProject();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      description: "",
      assigneeName: "",
      priority: "Media",
    },
  });

  /**
   * Maneja el cambio de estado de completado de una tarea.
   * @param {string} taskId - El ID de la tarea a actualizar.
   * @param {boolean} checked - El nuevo estado de completado.
   */
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleTaskCheck = async (taskId: string, checked: boolean) => {
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId ? { ...task, completed: checked } : task
    );
    try {
      await db.projects.update(project.id, { tasks: updatedTasks });
    } catch (error) {
      console.error("Error updating task: ", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar la tarea."});
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    const updatedTasks = project.tasks.filter(task => task.id !== taskId);
    try {
      await db.projects.update(project.id, { tasks: updatedTasks });
      toast({ title: "Tarea eliminada", description: "La tarea ha sido eliminada del proyecto."});
    } catch (error) {
      console.error("Error deleting task: ", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar la tarea."});
    }
    setTaskToDelete(null);
  };
  
  /**
   * Maneja el envío del formulario para crear una nueva tarea.
   * @param {TaskFormData} data - Los datos del formulario de la nueva tarea.
   */
  const onSubmit = async (data: TaskFormData) => {
    const initials = data.assigneeName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
      
    const newTask: Task = {
      id: uuidv4(),
      description: data.description,
      assignee: { name: data.assigneeName, initials: initials },
      priority: data.priority,
      completed: false,
    };

    try {
        const currentProject = await db.projects.get(project.id);
        if (currentProject) {
            const updatedTasks = [...currentProject.tasks, newTask];
            await db.projects.update(project.id, { tasks: updatedTasks });
        }
      reset();
      setOpen(false);
      toast({ title: "Tarea creada", description: "La nueva tarea ha sido añadida al proyecto."});
    } catch (error) {
      console.error("Error adding task: ", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo añadir la tarea."});
    }
  };

  /**
   * Determina la variante de estilo para el badge de prioridad.
   * @param {'Alta' | 'Media' | 'Baja'} priority - La prioridad de la tarea.
   * @returns {'destructive' | 'secondary' | 'outline'} La variante del badge.
   */
  const priorityBadgeVariant = (priority: 'Alta' | 'Media' | 'Baja'): 'destructive' | 'secondary' | 'outline' => {
    if (priority === 'Alta') return 'destructive';
    if (priority === 'Media') return 'secondary';
    return 'outline';
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Lista de Tareas</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear nueva tarea</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descripción
                  </Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Input id="description" {...field} className="col-span-3" />
                    )}
                  />
                  {errors.description && <p className="col-span-4 text-red-500 text-xs text-right">{errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assigneeName" className="text-right">
                    Asignado
                  </Label>
                   <Controller
                    name="assigneeName"
                    control={control}
                    render={({ field }) => (
                      <Input id="assigneeName" {...field} className="col-span-3" />
                    )}
                  />
                   {errors.assigneeName && <p className="col-span-4 text-red-500 text-xs text-right">{errors.assigneeName.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Prioridad
                  </Label>
                   <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar prioridad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Media">Media</SelectItem>
                            <SelectItem value="Baja">Baja</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Guardar Tarea</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead className="text-center">Prioridad</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.tasks.map((task) => (
                <TableRow key={task.id} data-state={task.completed ? 'completed' : 'pending'}>
                  <TableCell className="p-2">
                    <div className="flex items-center justify-center h-full">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => handleTaskCheck(task.id, Boolean(checked))}
                        aria-label={`Marcar tarea ${task.description} como completada`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                    {task.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                     <Badge variant={priorityBadgeVariant(task.priority)} className="capitalize w-20 justify-center">
                        {task.priority}
                     </Badge>
                  </TableCell>
                  <TableCell>
                    <AlertDialog open={taskToDelete === task.id} onOpenChange={() => setTaskToDelete(null)}>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setTaskToDelete(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la tarea de tu proyecto.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleTaskDelete(task.id)}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {project.tasks.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <p>No hay tareas en este proyecto todavía.</p>
            <p className="text-sm">¡Crea tu primera tarea para empezar!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
