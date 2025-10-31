
'use client';

import { useState, useEffect } from 'react';
import { useProject } from '../project-context';
import { Subcontractor } from '@/lib/data';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { SubcontractorDialog } from '@/components/subcontractor-dialog';

export default function SubcontractorsPage() {
  const project = useProject();
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);

  useEffect(() => {
    if (project.subcontractors) {
      setSubcontractors(project.subcontractors);
    }
  }, [project.subcontractors]);

  const addSubcontractor = async (subcontractor: Omit<Subcontractor, 'id'>) => {
    const newSubcontractor = { ...subcontractor, id: uuidv4() };
    const updatedSubcontractors = [...subcontractors, newSubcontractor];
    await db.projects.update(project.id, { subcontractors: updatedSubcontractors });
  };

  const deleteSubcontractor = async (id: string) => {
    const updatedSubcontractors = subcontractors.filter(s => s.id !== id);
    await db.projects.update(project.id, { subcontractors: updatedSubcontractors });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Subcontratas</CardTitle>
          <SubcontractorDialog onSave={addSubcontractor}>
            <Button>Añadir Subcontrata</Button>
          </SubcontractorDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Qué hace</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subcontractors.map(sub => (
              <TableRow key={sub.id}>
                <TableCell>{sub.name}</TableCell>
                <TableCell>{sub.company}</TableCell>
                <TableCell>{sub.role}</TableCell>
                <TableCell>{sub.email}</TableCell>
                <TableCell>{sub.phone}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => deleteSubcontractor(sub.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
