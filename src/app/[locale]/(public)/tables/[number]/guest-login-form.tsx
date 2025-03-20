'use client';

import { GuestLoginBody, GuestLoginBodyType } from '@/domain/schemas/guest.schema';
import { useRouter } from '@/i18n/navigation';
import { useGuestLoginMutation } from '@/infrastructure/queries/useGuest';
import { LoadingButton } from '@/libs/components/loading-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/libs/components/ui/form';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { initSocketInstance } from '@/libs/utils/init-socket';
import { useAuthStore } from '@/stores/auth.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function GuestLoginForm() {
  const searchParams = useSearchParams();
  const params = useParams();
  const token = searchParams.get('token');

  const tableNumber = Number(params.number);

  const router = useRouter();

  const loginMutation = useGuestLoginMutation();
  const setRole = useAuthStore((state) => state.setRole);
  const setSocket = useAuthStore((state) => state.setSocket);

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token ?? '',
      tableNumber
    }
  });

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [router, token]);

  const onSubmit = async (values: GuestLoginBodyType) => {
    if (loginMutation.isPending) return;

    try {
      const response = await loginMutation.mutateAsync(values);
      setRole(response.payload.data.guest.role);
      setSocket(initSocketInstance(response.payload.data.accessToken));
      router.push('/guest/menu');
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log('error', e);
            })}
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Tên khách hàng</Label>
                      <Input id="name" type="text" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <LoadingButton isLoading={loginMutation.isPending} type="submit" className="w-full">
                Đăng nhập
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
