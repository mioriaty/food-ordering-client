'use client';

import { useAuthContext } from '@/contexts/auth-context';
import { LoginBody, LoginBodyType } from '@/domain/schemas/auth.schema';
import { useLoginMutation } from '@/infrastructure/queries/useAuth';
import { LoadingButton } from '@/libs/components/loading-button';
import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/libs/components/ui/form';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { toast } from '@/libs/components/ui/use-toast';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function LoginForm() {
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearTokens = searchParams.get('clearTokens');
  const { setIsAuth } = useAuthContext();

  useEffect(() => {
    // WHY: Xử lý trường hợp lâu ngày vào web thì refresh token hết hạn => redirect về trang login và xoá tất cả tokens
    if (clearTokens) {
      setIsAuth(false);
    }
  }, [clearTokens, setIsAuth]);

  const handleSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return;

    try {
      const response = await loginMutation.mutateAsync(data);
      toast({
        description: response.payload.message
      });
      setIsAuth(true);
      router.push('/manage/dashboard');
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (err) => {
              console.error(err);
            })}
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input id="password" type="password" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <LoadingButton
                isLoading={form.formState.isLoading || form.formState.isSubmitting}
                type="submit"
                className="w-full"
              >
                Đăng nhập
              </LoadingButton>
              <Button variant="outline" className="w-full" type="button">
                Đăng nhập bằng Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
