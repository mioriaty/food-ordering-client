'use client';

import { UpdateDishBody, UpdateDishBodyType } from '@/domain/schemas/dish.schema';
import { useGetDishByIdQuery, useUpdateDishMutation } from '@/infrastructure/queries/useDish';
import { useMediaMutation } from '@/infrastructure/queries/useMedia';
import revalidateApiRequest from '@/infrastructure/services/revalidate.request';
import { LoadingButton } from '@/libs/components/loading-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/libs/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/libs/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/libs/components/ui/form';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { Textarea } from '@/libs/components/ui/textarea';
import { toast } from '@/libs/components/ui/use-toast';
import { DishStatus, DishStatusValues } from '@/libs/constants/type';
import { getVietnameseDishStatus } from '@/libs/utils/get-vn-dish-status';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function EditDish({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const { data } = useGetDishByIdQuery({ id: id as number, enabledCall: Boolean(id) });
  const updateDishMutation = useUpdateDishMutation();
  const uploadMediaMutation = useMediaMutation();

  const form = useForm<UpdateDishBodyType>({
    resolver: zodResolver(UpdateDishBody),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: undefined,
      status: DishStatus.Unavailable
    }
  });
  const image = form.watch('image');
  const name = form.watch('name');

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image;
  }, [file, image]);

  useEffect(() => {
    if (!data) return;
    const { image, name, price, status, description } = data.payload.data;
    form.reset({
      name,
      description,
      price,
      image: image ?? undefined,
      status
    });
  }, [data, form]);

  const handleSubmit = async (values: UpdateDishBodyType) => {
    if (updateDishMutation.isPending || uploadMediaMutation.isPending) return;

    try {
      let body: UpdateDishBodyType & { id: number } = { ...values, id: id as number };

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadImageRes = await uploadMediaMutation.mutateAsync(formData);
        const imageUrl = uploadImageRes.payload.data;
        body = {
          ...body,
          image: imageUrl
        };
      }

      const result = await updateDishMutation.mutateAsync(body);
      await revalidateApiRequest('dishes');

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
    form.reset();
    setFile(null);
    setId(undefined);
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
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật món ăn</DialogTitle>
          <DialogDescription>Các trường sau đây là bắ buộc: Tên, ảnh</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            onReset={handleReset}
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-dish-form"
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage className="object-cover" src={previewAvatarFromFile} />
                        <AvatarFallback className="rounded-none">{name || 'Avatar'}</AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            field.onChange('http://localhost:3000/' + file.name);
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên món ăn</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="name" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Giá</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="price" className="w-full" {...field} type="number" />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Mô tả sản phẩm</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Textarea id="description" className="w-full" {...field} />
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
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DishStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseDishStatus(status)}
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
          <LoadingButton type="submit" form="edit-dish-form" isLoading={updateDishMutation.isPending}>
            Lưu
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
