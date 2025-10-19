import { Building2, Download, RefreshCw } from "lucide-react";
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

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg font-bold">ConstructWise</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sincronizar Datos
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
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
                  <p className="text-sm font-medium leading-none">Usuario de ConstructWise</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    usuario@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
