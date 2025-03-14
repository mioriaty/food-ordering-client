import { EntityError } from '@/infrastructure/http/fetcher';
import { toast } from '@/libs/components/ui/use-toast';
import { UseFormSetError } from 'react-hook-form';

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      });
    });
  } else {
    console.log('error', error);

    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000
    });
  }
};
