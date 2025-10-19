
'use client';

import { useProject } from "../layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CalendarDays, Users, ClipboardList, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProjectVisitsPage() {
  const project = useProject();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold">Registro de Visitas</h2>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Nueva Visita
        </Button>
      </div>

      {project.visits.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 border-dashed">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Hay Visitas Registradas</h3>
            <p className="text-muted-foreground">Registra las visitas a obra para mantener un historial de actividades.</p>
             <Button className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Primera Visita
            </Button>
          </Card>
        ) : (
        <div className="space-y-4">
          {project.visits.map((visit) => (
            <Card key={visit.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                       <CalendarDays className="h-5 w-5 text-muted-foreground"/> 
                       <span className="font-sans">{new Date(visit.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </CardTitle>
                    <CardDescription className="mt-1 ml-8">Fase: <Badge variant="secondary">{visit.phase}</Badge></CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
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

    