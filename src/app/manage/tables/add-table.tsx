'use client';

import { CreateTableBody, CreateTableBodyType } from '@/domain/schemas/table.schema';
import { useCreateTableMutation } from '@/infrastructure/queries/useTable';
import { LoadingButton } from '@/libs/components/loading-button';
import { Button } from '@/libs/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/libs/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/libs/components/ui/form';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { toast } from '@/libs/components/ui/use-toast';
import { TableStatus, TableStatusValues } from '@/libs/constants/type';
import { getVietnameseTableStatus } from '@/libs/utils/get-vn-table-status';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function AddTable() {
  const createTableMutation = useCreateTableMutation();

  const [open, setOpen] = useState(false);
  const form = useForm<CreateTableBodyType>({
    resolver: zodResolver(CreateTableBody),
    defaultValues: {
      number: 0,
      capacity: 2,
      status: TableStatus.Hidden
    }
  });

  const handleSubmit = async (data: CreateTableBodyType) => {
    if (createTableMutation.isPending) return;

    try {
      const result = await createTableMutation.mutateAsync(data);

      toast({
        description: result.payload.message,
        variant: 'success'
      });
      handleReset();
      setOpen(false);
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Thêm bàn</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto" onCloseAutoFocus={() => form.reset()}>
        <DialogHeader>
          <DialogTitle>Thêm bàn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            onReset={handleReset}
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-table-form"
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Số hiệu bàn</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="number" type="number" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Lượng khách cho phép</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="capacity" className="w-full" {...field} type="number" />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Trạng thái</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TableStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseTableStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <LoadingButton isLoading={createTableMutation.isPending} type="submit" form="add-table-form">
            Thêm
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
