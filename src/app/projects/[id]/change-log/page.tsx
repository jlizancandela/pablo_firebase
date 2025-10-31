'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import type { ChangeLog } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { ChangeLogForm } from '@/components/change-log-form';

export default function ChangeLogPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<ChangeLog | undefined>(
    undefined
  );

  const fetchChangeLogs = async () => {
    if (projectId) {
      const logs = await db.changeLogs
        .where({ projectId })
        .sortBy('date');
      setChangeLogs(logs.reverse());
    }
  };

  useEffect(() => {
    fetchChangeLogs();
  }, [projectId]);

  const handleSave = async (data: Partial<ChangeLog>) => {
    if (editingLog) {
      await db.changeLogs.update(editingLog.id, data);
    } else {
      await db.changeLogs.add({
        id: uuidv4(),
        projectId,
        date: new Date(),
        ...data,
      } as ChangeLog);
    }
    await fetchChangeLogs();
    setIsDialogOpen(false);
    setEditingLog(undefined);
  };

  const handleDelete = async (id: string) => {
    await db.changeLogs.delete(id);
    await fetchChangeLogs();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Registro de Cambios</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingLog(undefined)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Registro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingLog ? 'Editar' : 'Añadir'} Registro de Cambio
                </DialogTitle>
              </DialogHeader>
              <ChangeLogForm
                projectId={projectId}
                changeLog={editingLog}
                onSave={handleSave}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingLog(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Cambio</TableHead>
              <TableHead>A quien se informó</TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {changeLogs.length > 0 ? (
              changeLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{log.change}</TableCell>
                  <TableCell>{log.informed.join(', ')}</TableCell>
                  <TableCell>{log.observations}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingLog(log);
                            setIsDialogOpen(true);
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(log.id)}>
                          Borrar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No hay registros de cambios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
