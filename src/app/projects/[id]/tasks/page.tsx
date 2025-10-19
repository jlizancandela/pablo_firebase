"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { getProjectById, Task } from "@/lib/data";
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
  const project = getProjectById(params.id);
  const [tasks, setTasks] = useState<Task[]>(project?.tasks || []);

  if (!project) {
    notFound();
  }

  const handleTaskCheck = (taskId: string, checked: boolean) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId ? { ...task, completed: checked } : task
      )
    );
  };
  
  const priorityBadgeVariant = (priority: 'High' | 'Medium' | 'Low'): 'destructive' | 'secondary' | 'outline' => {
    if (priority === 'High') return 'destructive';
    if (priority === 'Medium') return 'secondary';
    return 'outline';
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Task List</CardTitle>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead className="text-center">Priority</TableHead>
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
                        aria-label={`Mark task ${task.description} as complete`}
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
