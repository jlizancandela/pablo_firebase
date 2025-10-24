
'use client';

import { useState, useMemo } from "react";
import Header from "@/components/header";
import { useLiveQuery } from "dexie-react-hooks";
import { db, ProjectWithId } from "@/lib/db";
import { Task } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type FilterStatus = 'all' | 'pending' | 'completed';

interface TaskWithProjectInfo extends Task {
  projectName: string;
  projectId: string;
}

export default function AllTasksPage() {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const projects = useLiveQuery(() => db.projects.toArray(), []);

  const allTasks: TaskWithProjectInfo[] = useMemo(() => {
    if (!projects) return [];
    return projects.flatMap(project =>
      project.tasks.map(task => ({
        ...task,
        projectName: project.name,
        projectId: project.id,
      }))
    );
  }, [projects]);

  const filteredTasks = useMemo(() => {
    if (filter === 'pending') {
      return allTasks.filter(task => !task.completed);
    }
    if (filter === 'completed') {
      return allTasks.filter(task => task.completed);
    }
    return allTasks;
  }, [allTasks, filter]);

  const handleTaskCheck = async (taskId: string, projectId: string, checked: boolean) => {
    const project = await db.projects.get(projectId);
    if (!project) return;
    
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId ? { ...task, completed: checked } : task
    );

    try {
      await db.projects.update(projectId, { tasks: updatedTasks });
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const priorityBadgeVariant = (priority: 'Alta' | 'Media' | 'Baja'): 'destructive' | 'secondary' | 'outline' => {
    if (priority === 'Alta') return 'destructive';
    if (priority === 'Media') return 'secondary';
    return 'outline';
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            Todas las Tareas
          </h1>
          <div className="flex items-center gap-2">
            <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>Todas</Button>
            <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>Pendientes</Button>
            <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')}>Completadas</Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Asignado a</TableHead>
                    <TableHead className="text-center">Prioridad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No hay tareas que coincidan con el filtro.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id} data-state={task.completed ? 'completed' : 'pending'}>
                      <TableCell className="p-2">
                        <div className="flex items-center justify-center h-full">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={(checked) => handleTaskCheck(task.id, task.projectId, Boolean(checked))}
                            aria-label={`Marcar tarea ${task.description} como completada`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                        {task.description}
                      </TableCell>
                      <TableCell>
                        <Link href={`/projects/${task.projectId}/tasks`} className="hover:underline text-primary">
                          {task.projectName}
                        </Link>
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
      </main>
    </div>
  );
}
