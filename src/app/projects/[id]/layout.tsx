
'use client';

import { notFound, useParams } from "next/navigation";
import Header from "@/components/header";
import ProjectHeader from "@/components/project-header";
import ProjectNav from "@/components/project-nav";
import { useDoc, useFirebase, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Project } from "@/lib/data";
import { createContext, useContext, ReactNode } from "react";

// 1. Crear un contexto para los datos del proyecto
/**
 * @typedef {import('@/lib/data').Project} Project
 */

/**
 * Contexto de React para proporcionar los datos de un proyecto a sus componentes hijos.
 * @type {React.Context<Project | null>}
 */
const ProjectContext = createContext<Project | null>(null);

/**
 * Hook personalizado para acceder a los datos del proyecto desde el contexto.
 * Lanza un error si se utiliza fuera de un `ProjectProvider`.
 * @returns {Project} Los datos del proyecto actual.
 */
export const useProject = () => {
  const project = useContext(ProjectContext);
  if (!project) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return project;
};

// 2. Crear un componente proveedor
/**
 * Proveedor que obtiene los datos de un proyecto desde Firestore y los
 * pone a disposición de sus componentes hijos a través del `ProjectContext`.
 * @param {object} props - Propiedades del componente.
 * @param {ReactNode} props.children - Componentes hijos que tendrán acceso al contexto del proyecto.
 * @returns {JSX.Element} El proveedor de contexto con los hijos, o un estado de carga/no encontrado.
 */
function ProjectProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const id = params.id as string;
  const { firestore, user, isUserLoading } = useFirebase();

  const projectRef = useMemoFirebase(() => {
    // Solo construir la referencia si tanto el usuario como el ID están disponibles.
    if (!user || !id) return null;
    return doc(firestore, 'users', user.uid, 'projects', id);
  }, [firestore, user, id]);

  const { data: project, isLoading: isProjectLoading } = useDoc<Project>(projectRef);

  // CORRECCIÓN CRÍTICA: Debemos verificar tanto la carga del usuario como la del proyecto.
  // Si alguno está cargando, mostramos el indicador de carga.
  if (isUserLoading || isProjectLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando proyecto...</p>
      </div>
    );
  }

  // Solo después de que toda la carga esté completa, si no hay proyecto, entonces es un 404.
  if (!project) {
    return notFound();
  }

  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
}

/**
 * Layout principal para la página de un proyecto específico.
 * Envuelve el contenido de la página del proyecto con el `ProjectProvider`,
 * la cabecera y la navegación específica del proyecto.
 * @param {object} props - Propiedades del layout.
 * @param {ReactNode} props.children - El contenido de la página específica del proyecto (ej. Resumen, Tareas).
 * @returns {JSX.Element} El layout de la página del proyecto.
 */
export default function ProjectLayout({
  children,
}: {
  children: ReactNode;
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

/**
 * Componente contenedor que utiliza el contexto para pasar los datos del proyecto
 * al componente `ProjectHeader`.
 * @returns {JSX.Element} El componente de cabecera del proyecto con los datos inyectados.
 */
function ProjectHeaderWrapper() {
  const project = useProject();
  return <ProjectHeader project={project} />;
}
