import { notFound } from "next/navigation";
import Image from "next/image";
import { getProjectById } from "@/lib/data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, PlusCircle, Trash2 } from "lucide-react";

export default async function ProjectPhotosPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-headline font-bold">Galería de Fotos</h2>
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Foto
          </Button>
        </div>

        {project.photos.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 border-dashed">
            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Aún no hay fotos</h3>
            <p className="text-muted-foreground">Añade fotos para documentar el progreso del proyecto.</p>
            <Button className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Primera Foto
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {project.photos.map((photo) => (
              <Card key={photo.id} className="group overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={photo.url}
                      alt={photo.comment}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={photo.hint}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="destructive" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar foto</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-3 text-sm bg-card">
                  <p className="line-clamp-2">{photo.comment}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
