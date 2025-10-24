
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProjectNavProps {
  /**
   * El ID del proyecto actual, usado para construir las URLs de navegación.
   */
  projectId: string;
}

/**
 * Componente de navegación para las diferentes secciones de un proyecto.
 * Destaca el enlace de la sección activa.
 * @param {ProjectNavProps} props - Las propiedades del componente.
 * @returns {JSX.Element} La barra de navegación del proyecto.
 */
export default function ProjectNav({ projectId }: ProjectNavProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Resumen", href: `/projects/${projectId}` },
    { name: "Fases de Obra", href: `/projects/${projectId}/phases` },
    { name: "Tareas", href: `/projects/${projectId}/tasks` },
    { name: "Fotos", href: `/projects/${projectId}/photos` },
    { name: "Archivos", href: `/projects/${projectId}/files` },
    { name: "Visitas", href: `/projects/${projectId}/visits` },
  ];

  return (
    <nav className="mt-8 border-b">
      <div className="flex items-center gap-2 md:gap-4 -mb-px overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "py-3 px-2 md:px-4 font-medium text-muted-foreground transition-colors hover:text-primary border-b-2 border-transparent whitespace-nowrap",
                isActive && "text-primary border-primary"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
