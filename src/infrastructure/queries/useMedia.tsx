import mediaService from '@/infrastructure/services/media.service';
import { useMutation } from '@tanstack/react-query';

export const useMediaMutation = () => {
  return useMutation({
    mutationFn: mediaService.upload
  });
};
