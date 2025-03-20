'use client';

import { UpdateTableBody, UpdateTableBodyType } from '@/domain/schemas/table.schema';
import { Link } from '@/i18n/navigation';
import { useGetTableByIdQuery, useUpdateTableMutation } from '@/infrastructure/queries/useTable';
import { LoadingButton } from '@/libs/components/loading-button';
import { QRCodeTable } from '@/libs/components/qr-code-table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/libs/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/libs/components/ui/form';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { Switch } from '@/libs/components/ui/switch';
import { toast } from '@/libs/components/ui/use-toast';
import { TableStatus, TableStatusValues } from '@/libs/constants/type';
import { getTableLink } from '@/libs/utils/get-table-link';
import { getVietnameseTableStatus } from '@/libs/utils/get-vn-table-status';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface EditTableProps {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}

const EditTable = ({ id, setId, onSubmitSuccess }: EditTableProps) => {
  const { data } = useGetTableByIdQuery({ id: id as number, enabledCall: Boolean(id) });
  const updateTableMutation = useUpdateTableMutation();

  const form = useForm<UpdateTableBodyType>({
    resolver: zodResolver(UpdateTableBody),
    defaultValues: {
      capacity: 2,
      status: TableStatus.Hidden,
      changeToken: false
    }
  });

  useEffect(() => {
    if (!data) return;
    const { capacity, status } = data.payload.data;

    form.reset({
      capacity: capacity,
      status: status,
      changeToken: form.getValues('changeToken')
    });
  }, [data, form]);

  const handleSubmit = async (values: UpdateTableBodyType) => {
    if (updateTableMutation.isPending) return;

    try {
      const body: UpdateTableBodyType & { id: number } = { ...values, id: id as number };
      const result = await updateTableMutation.mutateAsync(body);

      toast({
        description: result.payload.message,
        variant: 'success'
      });
      onSubmitSuccess?.();
      handleReset();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  const handleReset = () => {
    setId(undefined);
    form.reset();
  };

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          handleReset();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[600px] max-h-screen overflow-auto"
        onCloseAutoFocus={() => {
          handleReset();
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật bàn ăn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            onReset={handleReset}
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-table-form"
          >
            <div className="grid gap-4 py-4">
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label htmlFor="name">Số hiệu bàn</Label>
                  <div className="col-span-3 w-full space-y-2">
                    {data && (
                      <Input
                        disabled
                        id="number"
                        type="number"
                        className="w-full"
                        value={data.payload.data.number}
                        readOnly
                      />
                    )}

                    <FormMessage />
                  </div>
                </div>
              </FormItem>
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Sức chứa (người)</Label>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
              <FormField
                control={form.control}
                name="changeToken"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Đổi QR Code</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="changeToken" checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label>QR Code</Label>
                  <div className="col-span-3 w-full space-y-2">
                    {data && <QRCodeTable token={data.payload.data.token} tableNumber={data.payload.data.number} />}
                  </div>
                </div>
              </FormItem>
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label>URL gọi món</Label>
                  <div className="col-span-3 w-full space-y-2">
                    {data && (
                      <Link
                        href={getTableLink({
                          token: data.payload.data.token,
                          tableNumber: data.payload.data.number
                        })}
                        target="_blank"
                        className="break-all"
                      >
                        {getTableLink({
                          token: data.payload.data.token,
                          tableNumber: data.payload.data.number
                        })}
                      </Link>
                    )}
                  </div>
                </div>
              </FormItem>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <LoadingButton isLoading={updateTableMutation.isPending} type="submit" form="edit-table-form">
            Lưu
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTable;
