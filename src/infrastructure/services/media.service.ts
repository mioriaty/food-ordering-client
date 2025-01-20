import { UploadImageResType } from '@/domain/schemas/media.schema';
import http from '@/infrastructure/http/fetcher';

const mediaService = {
  upload: (formData: FormData) => http.post<UploadImageResType>('/media/upload', formData)
};

export default mediaService;
