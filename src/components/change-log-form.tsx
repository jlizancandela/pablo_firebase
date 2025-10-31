'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChangeLog } from '@/lib/data';

const formSchema = z.object({
  change: z.string().min(1, 'El cambio es requerido.'),
  informed: z.string().min(1, 'Debe informar al menos a una persona.'),
  observations: z.string().optional(),
});

interface ChangeLogFormProps {
  projectId: string;
  changeLog?: ChangeLog;
  onSave: (data: Partial<ChangeLog>) => void;
  onCancel: () => void;
}

export function ChangeLogForm({
  projectId,
  changeLog,
  onSave,
  onCancel,
}: ChangeLogFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      change: changeLog?.change || '',
      informed: changeLog?.informed.join(', ') || '',
      observations: changeLog?.observations || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const informedArray = values.informed.split(',').map((s) => s.trim());
    onSave({
      ...values,
      informed: informedArray,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="change"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cambio</FormLabel>
              <FormControl>
                <Input placeholder="Descripción del cambio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="informed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>A quien se informó</FormLabel>
              <FormControl>
                <Input placeholder="Nombres separados por comas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observaciones adicionales"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  );
}
