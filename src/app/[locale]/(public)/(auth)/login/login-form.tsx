'use client';

import envConfig from '@/configs/env.config';
import { LoginBody, LoginBodyType } from '@/domain/schemas/auth.schema';
import { Link, useRouter } from '@/i18n/navigation';
import { useLoginMutation } from '@/infrastructure/queries/useAuth';
import { LoadingButton } from '@/libs/components/loading-button';
import SearchParamsLoader, { useSearchParamsLoader } from '@/libs/components/search-params-loader';
import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/libs/components/ui/form';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { toast } from '@/libs/components/ui/use-toast';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { initSocketInstance } from '@/libs/utils/init-socket';
import { useAuthStore } from '@/stores/auth.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const getOauthGoogleUrl = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(
      ' '
    )
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

const googleOAuthUrl = getOauthGoogleUrl();

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
  const { searchParams, setSearchParams } = useSearchParamsLoader();

  const clearTokens = searchParams?.get('clearTokens');
  const setRole = useAuthStore((state) => state.setRole);
  const setSocket = useAuthStore((state) => state.setSocket);
  const t = useTranslations('Login');

  useEffect(() => {
    // WHY: Xử lý trường hợp lâu ngày vào web thì refresh token hết hạn => redirect về trang login và xoá tất cả tokens
    if (clearTokens) {
      setRole(undefined);
    }
  }, [clearTokens, setRole]);

  const handleSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return;

    try {
      const response = await loginMutation.mutateAsync(data);
      toast({
        description: response.payload.message
      });
      setRole(response.payload.data.account.role);
      setSocket(initSocketInstance(response.payload.data.accessToken));
      router.push('/manage/dashboard');
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Card className="mx-auto max-w-[400px] w-full">
      <SearchParamsLoader onParamsReceived={setSearchParams} />

      <CardHeader>
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
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
                {t('buttonLogin')}
              </LoadingButton>

              <Link href={googleOAuthUrl}>
                <Button variant="outline" className="w-full" type="button">
                  {t('loginWithGoogle')}
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
