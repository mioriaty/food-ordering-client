import {
  AccountListResType,
  AccountResType,
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
  CreateEmployeeAccountBodyType,
  CreateGuestBodyType,
  CreateGuestResType,
  GetGuestListQueryParamsType,
  GetListGuestsResType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '@/domain/schemas/account.schema';
import http from '@/infrastructure/http/fetcher';
import qs from 'query-string';

const prefix = '/accounts';

const accountService = {
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
  },

  listAccounts: async () => {
    const response = await http.get<AccountListResType>(`${prefix}`);
    return response;
  },
  createEmployee: async (data: CreateEmployeeAccountBodyType) => {
    const response = await http.post<AccountResType>(`${prefix}`, data);
    return response;
  },
  updateEmployee: async (id: number, data: UpdateEmployeeAccountBodyType) => {
    const response = await http.put<AccountResType>(`${prefix}/detail/${id}`, data);
    return response;
  },
  deleteEmployee: async (id: number) => {
    const response = await http.delete<AccountResType>(`${prefix}/detail/${id}`);
    return response;
  },
  getEmployee: async (id: number) => {
    const response = await http.get<AccountResType>(`${prefix}/detail/${id}`);
    return response;
  },
  guestList: async (queries: GetGuestListQueryParamsType) => {
    return http.get<GetListGuestsResType>(
      `${prefix}/guests?${qs.stringify({
        fromDate: queries.fromDate?.toISOString(),
        toDate: queries.toDate?.toISOString()
      })}`
    );
  },
  createGuest: (body: CreateGuestBodyType) => http.post<CreateGuestResType>(`${prefix}/guests`, body)
};

export default accountService;
