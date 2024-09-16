import { RequestErrorEntity } from '@/entities/errors/auth.entity';
import { UseFormSetError } from 'react-hook-form';

import { toast } from '@/shared/components/ui/use-toast';

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof RequestErrorEntity && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      });
    });
  } else {
    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000
    });
  }
};
