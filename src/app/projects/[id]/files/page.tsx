
'use client';

import { useProject } from "../layout";
import { FileAttachment } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Download, Trash2, FileArchive } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Timestamp } from "firebase/firestore";

/**
 * Devuelve un icono basado en el tipo de archivo.
 * @param {FileAttachment['fileType']} fileType - El tipo de archivo.
 * @returns {JSX.Element} Un componente de icono.
 */
function getFileIcon(fileType: FileAttachment['fileType']) {
  switch (fileType) {
    case 'pdf':
      return <FileText className="text-red-500" />;
    case 'doc':
      return <FileText className="text-blue-500" />;
    case 'xls':
      return <FileText className="text-green-500" />;
    case 'dwg':
      return <FileText className="text-purple-500" />;
    default:
      return <FileText className="text-gray-500" />;
  }
}

/**
 * Formatea una fecha para mostrarla en la interfaz.
 * Admite objetos Timestamp de Firestore, objetos Date de JS o cadenas de fecha.
 * @param {any} date - La fecha a formatear.
 * @returns {string} La fecha formateada como una cadena.
 */
function formatDate(date: any): string {
    if (!date) return '';
    if (date instanceof Timestamp) {
        return date.toDate().toLocaleDateString();
    }
    if (date instanceof Date) {
        return date.toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
}

/**
 * Página que muestra la lista de archivos asociados a un proyecto.
 * @returns {JSX.Element} El componente de la página de archivos del proyecto.
 */
export default function ProjectFilesPage() {
  const project = useProject();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold">Archivos del Proyecto</h2>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Subir Archivo
        </Button>
      </div>

      {project.files.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 border-dashed">
          <FileArchive className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Aún no hay archivos</h3>
          <p className="text-muted-foreground">Sube documentos, planos y otros archivos del proyecto.</p>
          <Button className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Subir Primer Archivo
          </Button>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Tipo</TableHead>
                  <TableHead>Nombre del Archivo</TableHead>
                  <TableHead>Fase</TableHead>
                  <TableHead>Fecha de Subida</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="flex justify-center items-center">
                      {getFileIcon(file.fileType)}
                      <span className="sr-only">{file.fileType}</span>
                    </TableCell>
                    <TableCell className="font-medium">{file.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{file.phase}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={file.url} download>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Descargar</span>
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
