
'use client';

import { useParams } from "next/navigation";
import Header from "@/components/header";
import ProjectHeader from "@/components/project-header";
import ProjectNav from "@/components/project-nav";
import { ReactNode } from "react";
import { ProjectProvider, useProject } from "./project-context";


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
