
'use client';

import { useProject } from "../layout";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Radio } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Phase, PhaseStatus, CheckpointStatus, Checkpoint } from "@/lib/data";
import { useFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

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
  const { firestore, user } = useFirebase();

  /**
   * Maneja el cambio de valor de un campo de un checkpoint (ej. un checkbox).
   * @param {string} phaseId - El ID de la fase.
   * @param {string} checkpointId - El ID del checkpoint.
   * @param {string} fieldId - El ID del campo a actualizar.
   * @param {any} newValue - El nuevo valor para el campo.
   */
  const handleFieldChange = async (phaseId: string, checkpointId: string, fieldId: string, newValue: any) => {
    if (!user) return;

    const newPhases: Phase[] = JSON.parse(JSON.stringify(project.phases));
    const phaseIndex = newPhases.findIndex(p => p.id === phaseId);
    if (phaseIndex === -1) return;
    const checkpointIndex = newPhases[phaseIndex].checkpoints.findIndex(c => c.id === checkpointId);
    if (checkpointIndex === -1) return;
    const fieldIndex = newPhases[phaseIndex].checkpoints[checkpointIndex].fields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1) return;

    newPhases[phaseIndex].checkpoints[checkpointIndex].fields[fieldIndex].value = newValue;

    const projectRef = doc(firestore, 'users', user.uid, 'projects', project.id);

    try {
      await updateDoc(projectRef, { phases: newPhases });
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  /**
   * Maneja el clic en una fase para ciclar su estado (No iniciada -> En curso -> Completada).
   * @param {React.MouseEvent} e - El evento de clic del ratón.
   * @param {string} phaseId - El ID de la fase que se está actualizando.
   */
  const handlePhaseClick = async (e: React.MouseEvent, phaseId: string) => {
    e.stopPropagation();
    if (!user) return;
    
    const newPhases: Phase[] = JSON.parse(JSON.stringify(project.phases));
    const phaseIndex = newPhases.findIndex(p => p.id === phaseId);
    if (phaseIndex === -1) return;

    const currentStatus = newPhases[phaseIndex].status;
    let nextStatus: PhaseStatus;

    if (currentStatus === 'No iniciada') {
      nextStatus = 'En curso';
    } else if (currentStatus === 'En curso') {
      nextStatus = 'Completada';
    } else { // 'Completada'
      nextStatus = 'No iniciada';
    }
    
    newPhases[phaseIndex].status = nextStatus;
    
    const projectRef = doc(firestore, 'users', user.uid, 'projects', project.id);
    try {
      await updateDoc(projectRef, { phases: newPhases });
    } catch (error) {
      console.error("Error updating phase status:", error);
    }
  };

  /**
   * Maneja el clic en un checkpoint para ciclar su estado (No iniciado -> En curso -> Completado).
   * @param {string} phaseId - El ID de la fase a la que pertenece el checkpoint.
   * @param {string} checkpointId - El ID del checkpoint que se está actualizando.
   */
  const handleCheckpointClick = async (phaseId: string, checkpointId: string) => {
    if (!user) return;

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

    const projectRef = doc(firestore, 'users', user.uid, 'projects', project.id);
    try {
      await updateDoc(projectRef, { phases: newPhases });
    } catch (error) {
      console.error("Error updating checkpoint status:", error);
    }
  };


  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-headline font-bold">Fases de Obra</h2>
        </div>
      
      <Card>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {project.phases.map((phase, index) => (
              <AccordionItem value={`item-${index}`} key={phase.id}>
                <AccordionTrigger 
                  className="p-6 hover:no-underline"
                  onClick={(e) => handlePhaseClick(e, phase.id)}
                >
                  <div className="flex items-center gap-4 w-full">
                    {statusIcon(phase.status)}
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-lg">{phase.title}</h3>
                      <p className="text-sm text-muted-foreground">{phase.objective}</p>
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
                          <div className="p-4 cursor-pointer" onClick={() => handleCheckpointClick(phase.id, checkpoint.id)}>
                            <div className="flex items-center justify-between">
                                <h4 className="text-base font-medium">{checkpoint.title}</h4>
                               <Badge variant={statusBadgeVariant(checkpoint.status)} className="text-xs">
                                {checkpoint.status}
                               </Badge>
                            </div>
                          </div>
                          <CardContent className="space-y-3 pt-0">
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
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
