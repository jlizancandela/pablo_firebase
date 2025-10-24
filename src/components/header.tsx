
'use client';

import { Building2, Download, RefreshCw, HardHat, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/db";
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/lib/data";

/**
 * Interfaz para el evento `beforeinstallprompt`.
 * Este evento no es estándar en todos los navegadores.
 * @interface BeforeInstallPromptEvent
 * @extends {Event}
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string,
  }>;
  prompt(): Promise<void>;
}

/**
 * Cabecera principal de la aplicación.
 * Muestra el logo, el nombre de la aplicación, acciones principales (como instalar PWA, sincronizar)
 * y el menú de usuario.
 * @returns {JSX.Element} El componente de la cabecera.
 */
export default function Header() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { toast } = useToast();
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('El usuario aceptó instalar la PWA');
      } else {
        console.log('El usuario rechazó instalar la PWA');
      }
      setInstallPrompt(null);
    });
  };

  const handleExportAll = async () => {
    toast({ title: "Iniciando exportación", description: "Recopilando todos los datos..." });
    try {
      const zip = new JSZip();
      const allProjects = await db.projects.toArray();
      
      const simplifiedProjects = [];

      for (const project of allProjects) {
        const projectFolder = zip.folder(`project_${project.id}`);
        const photoFolder = projectFolder?.folder('photos');
        
        const photoPromises = project.photos.map(async (photo) => {
          try {
            const response = await fetch(photo.url);
            const blob = await response.blob();
            const extension = blob.type.split('/')[1] || 'jpg';
            const filename = `photo_${photo.id}.${extension}`;
            photoFolder?.file(filename, blob);
            return { ...photo, url: `photos/${filename}` };
          } catch (e) {
            console.error(`Failed to fetch photo ${photo.url}`, e);
            return { ...photo, url: 'failed_to_download' };
          }
        });

        const updatedPhotos = await Promise.all(photoPromises);
        simplifiedProjects.push({ ...project, photos: updatedPhotos });
      }

      zip.file("data.json", JSON.stringify(simplifiedProjects, null, 2));

      toast({ title: "Generando archivo...", description: "Comprimiendo datos. Esto puede tardar un momento." });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `constructwise_backup_${new Date().toISOString().split('T')[0]}.zip`);

      toast({ title: "¡Exportación completada!", description: "Tu copia de seguridad ha sido descargada." });

    } catch (error) {
      console.error("Export failed:", error);
      toast({ variant: "destructive", title: "Error de exportación", description: "No se pudieron exportar los datos." });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast({ title: "Importando copia de seguridad...", description: "Leyendo el archivo. Por favor, espera." });

    try {
        const zip = await JSZip.loadAsync(file);
        const dataFile = zip.file('data.json');
        if (!dataFile) {
            throw new Error('El archivo data.json no se encontró en el ZIP.');
        }

        const content = await dataFile.async('string');
        let projectsToImport: Project[] = JSON.parse(content);
        
        // Process photos: convert relative paths back to Blob URLs
        for (const project of projectsToImport) {
            const photoFolder = zip.folder(`project_${project.id}/photos`);
            if (photoFolder) {
                const updatedPhotos = [];
                for (const photo of project.photos) {
                    const relativePath = photo.url.startsWith('photos/') ? photo.url.substring(7) : photo.url;
                    const photoFile = photoFolder.file(relativePath);
                    if (photoFile) {
                        const blob = await photoFile.async('blob');
                        const blobUrl = URL.createObjectURL(blob);
                        updatedPhotos.push({ ...photo, url: blobUrl });
                    } else {
                        updatedPhotos.push(photo); // Keep if not found
                    }
                }
                project.photos = updatedPhotos;
            }
             // Ensure dates are converted back to Date objects
            project.startDate = new Date(project.startDate);
        }

        await db.projects.clear();
        await db.projects.bulkAdd(projectsToImport as any);

        toast({ title: "¡Importación completada!", description: "Tus proyectos han sido restaurados." });
    } catch (error) {
        console.error("Import failed:", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
        toast({ variant: "destructive", title: "Error de importación", description: `No se pudo importar: ${errorMessage}` });
    } finally {
        // Reset file input
        if (importInputRef.current) {
            importInputRef.current.value = "";
        }
    }
};

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg font-bold">ConstructWise</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {installPrompt && (
            <Button variant="outline" size="sm" onClick={handleInstallClick}>
              <HardHat className="mr-2 h-4 w-4" />
              Instalar App
            </Button>
          )}
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refrescar Datos
          </Button>

          <input
            type="file"
            ref={importInputRef}
            className="hidden"
            accept=".zip"
            onChange={handleImport}
          />
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => importInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Importar Copia
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={handleExportAll}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Todo
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>CW</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Usuario Anónimo</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Modo Offline
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configuración</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
