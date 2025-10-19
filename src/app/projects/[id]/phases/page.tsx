
'use client';

import { useProject } from "../layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Radio, Paperclip } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Phase, Checkpoint, Field } from "@/lib/data";
import { useFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

const statusBadgeVariant = (status: 'No iniciada' | 'En curso' | 'Completada'): 'outline' | 'secondary' | 'default' => {
  if (status === 'No iniciada') return 'outline';
  if (status === 'En curso') return 'secondary';
  return 'default';
};

const statusIcon = (status: 'No iniciada' | 'En curso' | 'Completada') => {
  if (status === 'No iniciada') return <Circle className="h-5 w-5 text-muted-foreground" />;
  if (status === 'En curso') return <Radio className="h-5 w-5 text-yellow-500" />;
  return <CheckCircle2 className="h-5 w-5 text-green-500" />;
}

export default function ProjectPhasesPage() {
  const project = useProject();
  const { firestore, user } = useFirebase();

  const handleFieldChange = async (phaseId: string, checkpointId: string, fieldId: string, newValue: any) => {
    if (!user) return;

    // Create a deep copy of the phases array to avoid direct mutation
    const newPhases: Phase[] = JSON.parse(JSON.stringify(project.phases));

    const phaseIndex = newPhases.findIndex(p => p.id === phaseId);
    if (phaseIndex === -1) return;

    const checkpointIndex = newPhases[phaseIndex].checkpoints.findIndex(c => c.id === checkpointId);
    if (checkpointIndex === -1) return;

    const fieldIndex = newPhases[phaseIndex].checkpoints[checkpointIndex].fields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1) return;

    // Update the value of the specific field
    newPhases[phaseIndex].checkpoints[checkpointIndex].fields[fieldIndex].value = newValue;

    // TODO: Implement logic to update checkpoint and phase status based on field completion

    const projectRef = doc(firestore, 'users', user.uid, 'projects', project.id);

    try {
      // Update the entire 'phases' array in the Firestore document
      await updateDoc(projectRef, {
        phases: newPhases
      });
    } catch (error) {
      console.error("Error updating phase:", error);
      // Here you could add a toast notification to inform the user of the error
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
                <AccordionTrigger className="p-6 hover:no-underline">
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
                          <CardHeader>
                            <CardTitle className="text-base font-medium flex items-center justify-between">
                              {checkpoint.title}
                               <Badge variant={checkpoint.status === 'Completado' ? 'default' : 'outline'} className="text-xs">
                                {checkpoint.status}
                               </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {checkpoint.fields.map(field => (
                              <div key={field.id} className="flex items-center justify-between text-sm">
                                {field.type === 'checkbox' ? (
                                  <>
                                    <label htmlFor={field.id} className="flex items-center gap-3 cursor-pointer">
                                      <Checkbox 
                                        id={field.id} 
                                        checked={!!field.value} 
                                        onCheckedChange={(checked) => handleFieldChange(phase.id, checkpoint.id, field.id, checked)}
                                      />
                                      {field.label}
                                    </label>
                                  </>
                                ) : field.type === 'file' ? (
                                    <>
                                        <span>{field.label}</span>
                                        <Button variant="outline" size="sm">
                                            <Paperclip className="mr-2 h-4 w-4"/>
                                            {field.value ? "Ver Archivo" : "Adjuntar"}
                                        </Button>
                                    </>
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
