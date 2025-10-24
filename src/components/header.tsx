
'use client';

import { Building2, Download, RefreshCw, HardHat } from "lucide-react";
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
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    /**
     * Maneja el evento `beforeinstallprompt` para controlar la instalación de la PWA.
     * @param {Event} event - El evento `beforeinstallprompt`.
     */
    const handleBeforeInstallPrompt = (event: Event) => {
      // Previene que el mini-infobar aparezca en Chrome.
      event.preventDefault();
      // Guarda el evento para que pueda ser disparado más tarde.
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  /**
   * Maneja el clic en el botón de instalación.
   * Muestra el prompt de instalación al usuario.
   */
  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }
    // Muestra el prompt de instalación.
    installPrompt.prompt();
    // Espera a que el usuario responda al prompt.
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('El usuario aceptó instalar la PWA');
      } else {
        console.log('El usuario rechazó instalar la PWA');
      }
      // Solo podemos usar el prompt una vez.
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
        
        const photoPromises = project.photos.map(async (photo, index) => {
          try {
            const response = await fetch(photo.url);
            const blob = await response.blob();
            const extension = blob.type.split('/')[1] || 'jpg';
            const filename = `photo_${photo.id}.${extension}`;
            photoFolder?.file(filename, blob);
            // Return a path relative to the zip for the JSON
            return { ...photo, url: `photos/${filename}` };
          } catch (e) {
            console.error(`Failed to fetch photo ${photo.url}`, e);
            return { ...photo, url: 'failed_to_download' }; // Keep original URL but mark as failed
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
