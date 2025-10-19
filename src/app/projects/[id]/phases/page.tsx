
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Radio, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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

export default async function ProjectPhasesPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-headline font-bold">Fases de Obra</h2>
        </div>
      
      <Card>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
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
                                      <Checkbox id={field.id} checked={!!field.value} readOnly />
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
