import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CalendarDays, Users, ClipboardList, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function ProjectVisitsPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold">Site Visit Logs</h2>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Log New Visit
        </Button>
      </div>

      {project.visits.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 border-dashed">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Visits Logged</h3>
            <p className="text-muted-foreground">Log site visits to keep a record of on-site activities.</p>
             <Button className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Log First Visit
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
                       <span className="font-sans">{visit.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </CardTitle>
                    <CardDescription className="mt-1 ml-8">Phase: <Badge variant="secondary">{visit.phase}</Badge></CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Visit</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-2">
                        <h4 className="font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-muted-foreground"/>Attendees</h4>
                        <div className="flex flex-wrap gap-1">
                            {visit.attendees.map(attendee => <Badge key={attendee} variant="outline">{attendee}</Badge>)}
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <h4 className="font-semibold flex items-center gap-2"><ClipboardList className="h-5 w-5 text-muted-foreground"/>Observations</h4>
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
