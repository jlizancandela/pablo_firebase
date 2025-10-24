
'use client';

import { useProject } from "../project-context";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Radio, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Phase, PhaseStatus, CheckpointStatus, Checkpoint } from "@/lib/data";
import { db } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/**
 * Determina la variante de estilo para un badge de estado.
 * @param {PhaseStatus | CheckpointStatus} status - El estado actual de la fase o checkpoint.
 * @returns {'outline' | 'secondary' | 'default'} La variante del badge.
 */
const statusBadgeVariant = (status: PhaseStatus | CheckpointStatus): 'outline' | 'secondary' | 'default' => {
  if (status === 'No iniciada' || status === 'No iniciado') return 'outline';
  if (status === 'En curso') return 'secondary';
  return 'default';
};

/**
 * Devuelve un icono basado en el estado de una fase o checkpoint.
 * @param {PhaseStatus | CheckpointStatus} status - El estado actual.
 * @returns {JSX.Element} Un componente de icono.
 */
const statusIcon = (status: PhaseStatus | CheckpointStatus) => {
  if (status === 'No iniciada' || status === 'No iniciado') return <Circle className="h-5 w-5 text-muted-foreground" />;
  if (status === 'En curso') return <Radio className="h-5 w-5 text-yellow-500" />;
  return <CheckCircle2 className="h-5 w-5 text-green-500" />;
}

/**
 * Página que muestra y gestiona las fases de obra de un proyecto.
 * Permite actualizar el estado de las fases y sus checkpoints.
 * @returns {JSX.Element} El componente de la página de fases.
 */
export default function ProjectPhasesPage() {
  const project = useProject();
  const { toast } = useToast();
  const [checkpointNotes, setCheckpointNotes] = useState<Record<string, string>>({});

  const updatePhases = async (newPhases: Phase[]) => {
    try {
      await db.projects.update(project.id, { phases: newPhases });
    } catch (error) {
      console.error("Error updating phases:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los cambios en las fases.",
      });
    }
  }

  /**
   * Maneja el cambio de valor de un campo de un checkpoint (ej. un checkbox).
   * @param {string} phaseId - El ID de la fase.
   * @param {string} checkpointId - El ID del checkpoint.
   * @param {string} fieldId - El ID del campo a actualizar.
   * @param {any} newValue - El nuevo valor para el campo.
   */
  const handleFieldChange = async (phaseId: string, checkpointId: string, fieldId: string, newValue: any) => {
    const newPhases: Phase[] = JSON.parse(JSON.stringify(project.phases));
    const phaseIndex = newPhases.findIndex(p => p.id === phaseId);
    if (phaseIndex === -1) return;
    const checkpointIndex = newPhases[phaseIndex].checkpoints.findIndex(c => c.id === checkpointId);
    if (checkpointIndex === -1) return;
    const fieldIndex = newPhases[phaseIndex].checkpoints[checkpointIndex].fields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1) return;

    newPhases[phaseIndex].checkpoints[checkpointIndex].fields[fieldIndex].value = newValue;

    await updatePhases(newPhases);
  };
  
  /**
   * Maneja el cambio en el campo de notas de un checkpoint.
   * @param {string} checkpointId - El ID del checkpoint que se está comentando.
   * @param {string} text - El texto de las notas.
   */
  const handleNotesChange = (checkpointId: string, text: string) => {
    setCheckpointNotes(prev => ({ ...prev, [checkpointId]: text }));
  };

  /**
   * Guarda las notas de un checkpoint en la base de datos.
   * @param {string} phaseId - El ID de la fase a la que pertenece el checkpoint.
   * @param {string} checkpointId - El ID del checkpoint cuyas notas se van a guardar.
   */
  const handleSaveNotes = async (phaseId: string, checkpointId: string) => {
    const newPhases: Phase[] = JSON.parse(JSON.stringify(project.phases));
    const phaseIndex = newPhases.findIndex(p => p.id === phaseId);
    if (phaseIndex === -1) return;
    const checkpointIndex = newPhases[phaseIndex].checkpoints.findIndex(c => c.id === checkpointId);
    if (checkpointIndex === -1) return;

    newPhases[phaseIndex].checkpoints[checkpointIndex].notes = checkpointNotes[checkpointId] ?? newPhases[phaseIndex].checkpoints[checkpointIndex].notes;
    
    await updatePhases(newPhases);

    toast({
      title: 'Notas guardadas',
      description: 'Tus apuntes han sido guardados.',
    });
  };

  /**
   * Recalcula y actualiza el estado de una fase basándose en el estado de sus checkpoints.
   * @param {Phase} phase - La fase a recalcular.
   * @returns {PhaseStatus} El nuevo estado calculado para la fase.
   */
  const recalculatePhaseStatus = (phase: Phase): PhaseStatus => {
    const totalCheckpoints = phase.checkpoints.length;
    if (totalCheckpoints === 0) return phase.status;

    const completedCount = phase.checkpoints.filter(c => c.status === 'Completado').length;
    const notStartedCount = phase.checkpoints.filter(c => c.status === 'No iniciado').length;

    if (completedCount === totalCheckpoints) {
      return 'Completada';
    }
    if (notStartedCount === totalCheckpoints) {
      return 'No iniciada';
    }
    return 'En curso';
  };

  /**
   * Maneja el clic en un checkpoint para ciclar su estado (No iniciado -> En curso -> Completado).
   * También recalcula y actualiza el estado de la fase principal.
   * @param {string} phaseId - El ID de la fase a la que pertenece el checkpoint.
   * @param {string} checkpointId - El ID del checkpoint que se está actualizando.
   */
  const handleCheckpointClick = async (phaseId: string, checkpointId: string) => {
    const newPhases: Phase[] = JSON.parse(JSON.stringify(project.phases));
    const phaseIndex = newPhases.findIndex(p => p.id === phaseId);
    if (phaseIndex === -1) return;

    const checkpointIndex = newPhases[phaseIndex].checkpoints.findIndex(c => c.id === checkpointId);
    if (checkpointIndex === -1) return;

    const currentStatus = newPhases[phaseIndex].checkpoints[checkpointIndex].status;
    let nextStatus: CheckpointStatus;

    if (currentStatus === 'No iniciado') {
      nextStatus = 'En curso';
    } else if (currentStatus === 'En curso') {
      nextStatus = 'Completado';
    } else { // 'Completado'
      nextStatus = 'No iniciado';
    }

    newPhases[phaseIndex].checkpoints[checkpointIndex].status = nextStatus;

    // Recalcular el estado de la fase principal
    newPhases[phaseIndex].status = recalculatePhaseStatus(newPhases[phaseIndex]);

    await updatePhases(newPhases);
  };


  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-headline font-bold">Fases de Obra</h2>
        </div>
      
      <Card>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {project.phases.map((phase, index) => {
               const totalCheckpoints = phase.checkpoints.length;
               const completedCheckpoints = phase.checkpoints.filter(c => c.status === 'Completado').length;
               const progress = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0;

              return (
              <AccordionItem value={`item-${index}`} key={phase.id}>
                <AccordionTrigger 
                  className="p-6 hover:no-underline"
                >
                  <div className="flex items-start gap-4 w-full">
                    <div className="mt-1">
                      {statusIcon(phase.status)}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-lg">{phase.title}</h3>
                      <p className="text-sm text-muted-foreground">{phase.objective}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <Progress value={progress} className="h-2 w-full max-w-xs" />
                        <span className="text-sm font-medium text-muted-foreground">{progress}%</span>
                      </div>
                    </div>
                    <Badge variant={statusBadgeVariant(phase.status)} className="w-28 justify-center hidden md:flex">
                      {phase.status}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-muted/40 px-6 pb-6">
                  <div className="space-y-4 pt-4">
                    {phase.checkpoints.length > 0 ? (
                      phase.checkpoints.map(checkpoint => (
                        <Card key={checkpoint.id}>
                           <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => handleCheckpointClick(phase.id, checkpoint.id)}>
                            <div className="flex items-center gap-3">
                              {statusIcon(checkpoint.status)}
                              <h4 className="text-base font-medium">{checkpoint.title}</h4>
                            </div>
                            <Badge variant={statusBadgeVariant(checkpoint.status)} className="text-xs">
                             {checkpoint.status}
                            </Badge>
                          </div>
                          <CardContent className="space-y-3 pt-0">
                            {checkpoint.fields.length > 0 && (
                                <div className="space-y-3">
                                {checkpoint.fields.map(field => (
                                <div key={field.id} className="flex items-center justify-between text-sm pl-2 border-l-2 ml-2">
                                    {field.type === 'checkbox' ? (
                                        <label htmlFor={field.id} className="flex items-center gap-3 cursor-pointer py-1">
                                        <Checkbox 
                                            id={field.id} 
                                            checked={!!field.value} 
                                            onCheckedChange={(checked) => handleFieldChange(phase.id, checkpoint.id, field.id, checked)}
                                        />
                                        {field.label}
                                        </label>
                                    ) : (
                                    <span>{field.label}: {String(field.value)}</span>
                                    )}
                                </div>
                                ))}
                                </div>
                            )}

                            <div className="space-y-2 pt-2">
                                <Textarea
                                placeholder="Añade tus apuntes aquí..."
                                value={checkpointNotes[checkpoint.id] ?? checkpoint.notes ?? ''}
                                onChange={(e) => handleNotesChange(checkpoint.id, e.target.value)}
                                className="text-sm"
                                />
                                {(checkpointNotes[checkpoint.id] !== undefined && checkpointNotes[checkpoint.id] !== (checkpoint.notes ?? '')) && (
                                <Button size="sm" className="w-full" onClick={() => handleSaveNotes(phase.id, checkpoint.id)}>
                                    <Save className="mr-2 h-4 w-4"/> Guardar Apuntes
                                </Button>
                                )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Esta fase aún no tiene checkpoints definidos.</p>
                    )}
                    <p className="text-xs text-muted-foreground pt-2">
                        <strong>Criterio de cierre:</strong> {phase.closingCriteria}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )})}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
