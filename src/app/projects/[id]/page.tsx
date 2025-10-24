
'use client';

import { useProject } from "./layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/**
 * Formatea una fecha para mostrarla en la interfaz.
 * @param {Date} date - La fecha a formatear.
 * @returns {string} La fecha formateada como una cadena legible.
 */
function formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
}

/**
 * Página de resumen del proyecto.
 * Muestra los detalles clave del proyecto y un resumen del progreso general.
 * @returns {JSX.Element} El componente de la página de resumen del proyecto.
 */
export default function ProjectOverviewPage() {
  const project = useProject();

  const completedPhases = project.phases.filter(p => p.status === 'Completada').length;
  const totalPhases = project.phases.length;
  const progress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Detalles del Proyecto</CardTitle>
            <CardDescription>Información clave sobre el proyecto.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Cliente</p>
                <p className="font-semibold text-base">{project.client}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Fecha de Inicio</p>
                <p className="font-semibold text-base">{formatDate(project.startDate)}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Tipo de Proyecto</p>
                <span className="font-semibold text-base"><Badge variant="secondary" className="text-base">{project.projectType}</Badge></span>
              </div>
              <div className="md:col-span-2">
                <p className="font-medium text-muted-foreground">Dirección</p>
                <p className="font-semibold text-base">{project.address}</p>
              </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Resumen de Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-base font-medium text-foreground">Progreso de Fases</span>
                <span className="text-sm font-medium text-foreground">{completedPhases} de {totalPhases}</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-right text-sm text-muted-foreground mt-1">{progress}% Completado</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
