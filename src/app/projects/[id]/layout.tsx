
'use client';

import { notFound, useParams } from "next/navigation";
import Header from "@/components/header";
import ProjectHeader from "@/components/project-header";
import ProjectNav from "@/components/project-nav";
import { useDoc, useFirebase, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Project } from "@/lib/data";
import { createContext, useContext, ReactNode } from "react";

// 1. Create a context for the project data
const ProjectContext = createContext<Project | null>(null);

// Custom hook to use the project context
export const useProject = () => {
  const project = useContext(ProjectContext);
  if (!project) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return project;
};

// 2. Create a provider component
function ProjectProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const id = params.id as string;
  const { firestore, user } = useFirebase();

  const projectRef = useMemoFirebase(() => {
    if (!user || !id) return null;
    return doc(firestore, 'users', user.uid, 'projects', id);
  }, [firestore, user, id]);

  const { data: project, isLoading } = useDoc<Project>(projectRef);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando proyecto...</p>
      </div>
    );
  }

  if (!project) {
    return notFound();
  }

  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
}


export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const id = params.id as string;
  
  return (
    <ProjectProvider>
      <div className="min-h-screen w-full bg-background">
        <Header />
        <main className="container">
          <ProjectHeaderWrapper />
          <ProjectNav projectId={id} />
          <div className="py-8">
            {children}
          </div>
        </main>
      </div>
    </ProjectProvider>
  );
}

// Wrapper component to use the context
function ProjectHeaderWrapper() {
  const project = useProject();
  return <ProjectHeader project={project} />;
}

    