
import { useState } from 'react';
import { Subcontractor } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SubcontractorDialogProps {
  subcontractor?: Subcontractor | null;
  onSave: (subcontractor: Omit<Subcontractor, 'id'>) => void;
  children: React.ReactNode;
}

export function SubcontractorDialog({ subcontractor, onSave, children }: SubcontractorDialogProps) {
  const [name, setName] = useState(subcontractor?.name || '');
  const [company, setCompany] = useState(subcontractor?.company || '');
  const [role, setRole] = useState(subcontractor?.role || '');
  const [email, setEmail] = useState(subcontractor?.email || '');
  const [phone, setPhone] = useState(subcontractor?.phone || '');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSave({ name, company, role, email, phone });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{subcontractor ? 'Editar Subcontrata' : 'Añadir Subcontrata'}</DialogTitle>
          <DialogDescription>
            {subcontractor ? 'Edita los detalles y guarda los cambios.' : 'Añade una nueva subcontrata al proyecto.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nombre</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">Empresa</Label>
            <Input id="company" value={company} onChange={e => setCompany(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Qué hace</Label>
            <Input id="role" value={role} onChange={e => setRole(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" value={email} onChange={e => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Teléfono</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
