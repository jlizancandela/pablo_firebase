import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data";
import Header from "@/components/header";
import ProjectHeader from "@/components/project-header";
import ProjectNav from "@/components/project-nav";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="container">
        <ProjectHeader project={project} />
        <ProjectNav projectId={project.id} />
        <div className="py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
