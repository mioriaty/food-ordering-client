'use client';

import { ChangePasswordV2Body, ChangePasswordV2BodyType } from '@/domain/schemas/account.schema';
import { useChangePasswordMeMutation } from '@/infrastructure/queries/useMe';
import { LoadingButton } from '@/libs/components/loading-button';
import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/libs/components/ui/form';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { toast } from '@/libs/components/ui/use-toast';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from '@/libs/utils/local-authentication';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function ChangePasswordForm() {
  const changePasswordMutation = useChangePasswordMeMutation();

  const form = useForm<ChangePasswordV2BodyType>({
    resolver: zodResolver(ChangePasswordV2Body),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  });

  const handleReset = () => {
    form.clearErrors();
    form.reset();
  };

  const handleSubmit = async (data: ChangePasswordV2BodyType) => {
    if (changePasswordMutation.isPending) return;

    try {
      const result = await changePasswordMutation.mutateAsync(data);
      setAccessTokenToLocalStorage(result.payload.data.accessToken);
      setRefreshTokenToLocalStorage(result.payload.data.refreshToken);
      toast({
        description: result.payload.message,
        variant: 'success'
      });
      handleReset();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            {/* <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                      <Input autoComplete="off" id="oldPassword" type="password" className="w-full" {...field} />
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
                    <div className="grid gap-3">
                      <Label htmlFor="password">Mật khẩu mới</Label>
                      <Input autoComplete="off" id="password" type="password" className="w-full" {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="confirmPassword">Nhập lại mật khẩu mới</Label>
                      <Input autoComplete="off" id="confirmPassword" type="password" className="w-full" {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className=" items-center gap-2 md:ml-auto flex">
                <Button onClick={handleReset} variant="outline" size="sm" type="reset">
                  Hủy
                </Button>
                <LoadingButton isLoading={changePasswordMutation.isPending} type="submit" size="sm">
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
