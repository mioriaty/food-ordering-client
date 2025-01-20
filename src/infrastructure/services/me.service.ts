import { AccountResType, UpdateMeBodyType } from '@/domain/schemas/account.schema';
import http from '@/infrastructure/http/fetcher';

const meService = {
  getMe: async () => {
    const response = await http.get<AccountResType>('/accounts/me');
    return response;
  },
  updateMe: async (data: UpdateMeBodyType) => {
    const response = await http.put<AccountResType>('/accounts/me', data);
    return response;
  }
};

export default meService;
