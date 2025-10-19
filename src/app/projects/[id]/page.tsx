import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function ProjectOverviewPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  const completedTasks = project.tasks.filter(t => t.completed).length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Project Details</CardTitle>
            <CardDescription>Key information about the project.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Client</p>
                <p className="font-semibold text-base">{project.client}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Start Date</p>
                <p className="font-semibold text-base">{project.startDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Project Type</p>
                <p className="font-semibold text-base"><Badge variant="secondary" className="text-base">{project.projectType}</Badge></p>
              </div>
              <div className="md:col-span-2">
                <p className="font-medium text-muted-foreground">Address</p>
                <p className="font-semibold text-base">{project.address}</p>
              </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Progress Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-base font-medium text-foreground">Tasks Completed</span>
                <span className="text-sm font-medium text-foreground">{completedTasks} of {totalTasks}</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-right text-sm text-muted-foreground mt-1">{progress}% Complete</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
