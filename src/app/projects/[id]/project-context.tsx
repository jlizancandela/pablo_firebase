
'use client';

import { createContext, useContext, ReactNode } from "react";
import { notFound, useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db, ProjectWithId } from "@/lib/db";

// 1. Crear un contexto para los datos del proyecto
const ProjectContext = createContext<ProjectWithId | null>(null);

/**
 * Hook personalizado para acceder a los datos del proyecto desde el contexto.
 * Lanza un error si se utiliza fuera de un `ProjectProvider`.
 * @returns {ProjectWithId} Los datos del proyecto actual.
 */
export const useProject = (): ProjectWithId => {
  const project = useContext(ProjectContext);
  if (!project) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return project;
};

// 2. Crear un componente proveedor
/**
 * Proveedor que obtiene los datos de un proyecto desde IndexedDB y los
 * pone a disposición de sus componentes hijos a través del `ProjectContext`.
 * @param {object} props - Propiedades del componente.
 * @param {ReactNode} props.children - Componentes hijos que tendrán acceso al contexto del proyecto.
 * @returns {JSX.Element} El proveedor de contexto con los hijos, o un estado de carga/no encontrado.
 */
export function ProjectProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const id = params.id as string;

  const project = useLiveQuery(() => db.projects.get(id), [id]);

  if (project === undefined) {
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
