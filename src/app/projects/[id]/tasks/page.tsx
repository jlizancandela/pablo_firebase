
"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getProjectById, Project, Task } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle } from "lucide-react";
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

export default function ProjectTasksPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const proj = await getProjectById(params.id);
      if (!proj) {
        notFound();
      } else {
        setProject(proj);
        setTasks(proj.tasks);
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [params.id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!project) {
    return notFound();
  }

  const handleTaskCheck = (taskId: string, checked: boolean) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId ? { ...task, completed: checked } : task
      )
    );
  };
  
  const priorityBadgeVariant = (priority: 'Alta' | 'Media' | 'Baja'): 'destructive' | 'secondary' | 'outline' => {
    if (priority === 'Alta') return 'destructive';
    if (priority === 'Media') return 'secondary';
    return 'outline';
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Lista de Tareas</CardTitle>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
