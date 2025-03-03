'use client';

import { UpdateMeBody, UpdateMeBodyType } from '@/domain/schemas/account.schema';
import { useMeQuery, useUpdateMeMutation } from '@/infrastructure/queries/useAccount';
import { useMediaMutation } from '@/infrastructure/queries/useMedia';
import { LoadingButton } from '@/libs/components/loading-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/libs/components/ui/avatar';
import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/libs/components/ui/form';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { toast } from '@/libs/components/ui/use-toast';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function UpdateProfileForm() {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: undefined
    }
  });
  const avatar = form.watch('avatar');
  const imageName = form.watch('name');
  const updateMeMutation = useUpdateMeMutation();
  const uploadMediaMutation = useMediaMutation();

  const { data: dataMe, refetch } = useMeQuery();

  useEffect(() => {
    if (dataMe) {
      const { data } = dataMe.payload;
      if (data) {
        form.reset({
          avatar: data.avatar ?? undefined,
          name: data.name
        });
      }
    }
  }, [dataMe, form]);

  // Nếu dùng nextjs 15 và react 19 thì không cần useMemo
  const previewAvatar = useMemo(() => {
    return file ? URL.createObjectURL(file) : avatar;
  }, [avatar, file]);

  const handleSubmit = async (data: UpdateMeBodyType) => {
    if (updateMeMutation.isPending || uploadMediaMutation.isPending) return;

    try {
      let body: UpdateMeBodyType = { ...data };

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadImageRes = await uploadMediaMutation.mutateAsync(formData);
        const imageUrl = uploadImageRes.payload.data;
        body = {
          ...data,
          avatar: imageUrl
        };
      }

      const result = await updateMeMutation.mutateAsync(body);

      toast({
        description: result.payload.message,
        variant: 'success'
      });
      refetch();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  const handleReset = () => {
    form.reset();
    setFile(null);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (err) => {
          console.error(err);
        })}
        className="grid auto-rows-max items-start gap-4 md:gap-8"
      >
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage className="object-cover" src={previewAvatar} />
                        <AvatarFallback className="rounded-none">{imageName}</AvatarFallback>
                      </Avatar>
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            const file = e.target.files[0];
                            setFile(file);
                            field.onChange('https://via.placeholder.com/150' + field.name);
                          }
                        }}
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => inputRef.current?.click()}
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
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input id="name" type="text" className="w-full" {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=" items-center gap-2 md:ml-auto flex">
                <Button variant="outline" size="sm" type="reset" onClick={handleReset}>
                  Hủy
                </Button>
                <LoadingButton
                  isLoading={updateMeMutation.isPending || uploadMediaMutation.isPending}
                  size="sm"
                  type="submit"
                >
                  Lưu thông tin
                </LoadingButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
