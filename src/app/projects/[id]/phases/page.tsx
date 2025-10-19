
'use client';

import { useRef } from "react";
import { useProject } from "../layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Radio, Paperclip, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Phase, Checkpoint, Field, FileAttachment } from "@/lib/data";
import { useFirebase } from "@/firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useToast } from "@/hooks/use-toast";

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
  const { uploadFile, isUploading } = useFileUpload();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentFieldInfo = useRef<{ phaseId: string; checkpointId: string; fieldId: string; fieldLabel: string; } | null>(null);


  const handleFileButtonClick = (phaseId: string, checkpointId: string, fieldId: string, fieldLabel: string) => {
    currentFieldInfo.current = { phaseId, checkpointId, fieldId, fieldLabel };
    fileInputRef.current?.click();
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase();
  }

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !currentFieldInfo.current) {
      return;
    }

    const file = event.target.files[0];
    const { phaseId, checkpointId, fieldId, fieldLabel } = currentFieldInfo.current;
    
    if (!user) return;

    try {
      const { downloadURL } = await uploadFile(file, `projects/${project.id}/files`);

      const newPhases: Phase[] = JSON.parse(JSON.stringify(project.phases));
      const phaseIndex = newPhases.findIndex(p => p.id === phaseId);
      if (phaseIndex === -1) return;
      const checkpointIndex = newPhases[phaseIndex].checkpoints.findIndex(c => c.id === checkpointId);
      if (checkpointIndex === -1) return;
      const fieldIndex = newPhases[phaseIndex].checkpoints[checkpointIndex].fields.findIndex(f => f.id === fieldId);
      if (fieldIndex === -1) return;

      newPhases[phaseIndex].checkpoints[checkpointIndex].fields[fieldIndex].value = downloadURL;

      const newFileAttachment: FileAttachment = {
        id: `file_${Date.now()}`,
        name: file.name,
        url: downloadURL,
        fileType: getFileExtension(file.name) as any || 'doc',
        uploadedAt: Timestamp.now(),
        phase: newPhases[phaseIndex].title,
      };

      const updatedFiles = [...project.files, newFileAttachment];
      
      const projectRef = doc(firestore, 'users', user.uid, 'projects', project.id);
      await updateDoc(projectRef, {
        phases: newPhases,
        files: updatedFiles,
      });

    } catch (error) {
      console.error("File upload process failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El proceso de subida de archivo falló.",
      });
    } finally {
        // Reset the input so the same file can be selected again
        if(event.target) event.target.value = '';
    }
  };


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
      console.error("Error updating phase:", error);
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
                                    <label htmlFor={field.id} className="flex items-center gap-3 cursor-pointer">
                                      <Checkbox 
                                        id={field.id} 
                                        checked={!!field.value} 
                                        onCheckedChange={(checked) => handleFieldChange(phase.id, checkpoint.id, field.id, checked)}
                                      />
                                      {field.label}
                                    </label>
                                ) : field.type === 'file' ? (
                                    <>
                                        <a href={field.value || '#'} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 ${!field.value ? 'pointer-events-none' : ''}`}>
                                            <span>{field.label}</span>
                                        </a>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleFileButtonClick(phase.id, checkpoint.id, field.id, field.label)}
                                            disabled={isUploading}
                                        >
                                            {isUploading && currentFieldInfo.current?.fieldId === field.id ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            ) : (
                                                <Paperclip className="mr-2 h-4 w-4"/>
                                            )}
                                            {field.value ? "Ver / Cambiar" : "Adjuntar"}
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
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        className="hidden"
      />
    </div>
  );
}
