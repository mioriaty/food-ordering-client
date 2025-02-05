import {
  AccountResType,
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
  UpdateMeBodyType
} from '@/domain/schemas/account.schema';
import http from '@/infrastructure/http/fetcher';

const prefix = '/accounts';

const meService = {
  getMe: async () => {
    const response = await http.get<AccountResType>(`${prefix}/me`);
    return response;
  },
  sGetMe: async (accessToken: string) => {
    const response = await http.get<AccountResType>(`${prefix}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  },
  updateMe: async (data: UpdateMeBodyType) => {
    const response = await http.put<AccountResType>(`${prefix}/me`, data);
    return response;
  },
  changePassword: async (data: ChangePasswordV2BodyType) => {
    const response = await http.put<ChangePasswordV2ResType>(`/api${prefix}/change-password-v2`, data, {
      baseUrl: ''
    });
    return response;
  },
  sChangePassword: async (accessToken: string, body: ChangePasswordV2BodyType) => {
    return http.put<ChangePasswordV2ResType>(`${prefix}/change-password-v2`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
};

export default meService;
