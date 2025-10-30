
'use client';

import { useState, useMemo } from "react";
import dynamic from 'next/dynamic';
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { type WorkLog } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

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


const WorkLogDialog = dynamic(() => import('@/components/work-log-dialog'), { ssr: false });

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
  
  const handleOpenDialog = (log: WorkLog | null) => {
    setLogToEdit(log);
    setOpen(true);
  };

  const onSubmit = async (data: any) => {
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

        {open && (
          <WorkLogDialog
            open={open}
            onOpenChange={setOpen}
            logToEdit={logToEdit}
            onSubmit={onSubmit}
            projects={projects}
          />
        )}

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
