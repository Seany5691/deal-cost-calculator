import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCalculatorStore } from '@/store/calculator';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  cost: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Cost must be a positive number',
  }),
});

interface AddItemDialogProps {
  sectionId: string;
}

export function AddItemDialog({ sectionId }: AddItemDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { addSessionItem } = useCalculatorStore();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: any) => {
    addSessionItem(sectionId, data.name, parseFloat(data.cost));
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message?.toString()}</p>
            )}
          </div>
          <div>
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              {...register('cost')}
              className={errors.cost ? 'border-red-500' : ''}
            />
            {errors.cost && (
              <p className="text-red-500 text-sm mt-1">{errors.cost.message?.toString()}</p>
            )}
          </div>
          <Button type="submit" className="w-full">Add Item</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}