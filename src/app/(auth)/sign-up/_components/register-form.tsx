'use client';

import { APP_ENV } from '@/infrastructure/schemas/env.schema';
import { RegisterRequestSchema, RegisterRequestType } from '@/infrastructure/schemas/register.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

import { PasswordInput } from '@/shared/components/password-input';

const formFields = [
  { name: 'name', label: 'Username', placeholder: 'your_name', type: 'text' },
  { name: 'email', label: 'Email', placeholder: 'your_email@gmail.com', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'confirmPassword', label: 'Password confirmation', type: 'password' }
];

export const RegisterForm = () => {
  const form = useForm<RegisterRequestType>({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values: RegisterRequestType) => {
    await fetch(`${APP_ENV.NEXT_PUBLIC_API_ENDPOINT}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json());
    form.reset();
  };

  const renderFormField = ({ name, label, placeholder, type }: (typeof formFields)[number]) => (
    <FormField
      key={name}
      control={form.control}
      name={name as keyof RegisterRequestType}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === 'password' ? (
              <PasswordInput {...field} />
            ) : (
              <Input placeholder={placeholder} type={type} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {formFields.map(renderFormField)}
        <Button type="submit">Register</Button>
      </form>
    </Form>
  );
};
