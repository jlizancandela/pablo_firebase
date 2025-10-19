"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProjectNavProps {
  projectId: string;
}

export default function ProjectNav({ projectId }: ProjectNavProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: `/projects/${projectId}` },
    { name: "Tasks", href: `/projects/${projectId}/tasks` },
    { name: "Photos", href: `/projects/${projectId}/photos` },
    { name: "Visits", href: `/projects/${projectId}/visits` },
  ];

  return (
    <nav className="mt-8 border-b">
      <div className="flex items-center gap-2 md:gap-4 -mb-px">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "py-3 px-2 md:px-4 font-medium text-muted-foreground transition-colors hover:text-primary border-b-2 border-transparent",
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
