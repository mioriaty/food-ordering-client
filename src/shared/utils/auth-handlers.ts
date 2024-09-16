import authApiRequest from '@/infrastructure/api-requests/auth';
import guestApiRequest from '@/infrastructure/api-requests/guest';
import { Role } from '@/shared/types/constants';
import { TokenPayload } from '@/shared/types/jwt';
import { isBrowser } from '@/shared/utils/browser';
import jwt from 'jsonwebtoken';

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};

export const getAccessTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('accessToken') : null);

export const getRefreshTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('refreshToken') : null);
export const setAccessTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem('accessToken', value);

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem('refreshToken', value);
export const removeTokensFromLocalStorage = () => {
  isBrowser && localStorage.removeItem('accessToken');
  isBrowser && localStorage.removeItem('refreshToken');
};
export const checkAndRefreshToken = async (param?: { onError?: () => void; onSuccess?: () => void }) => {
  // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
  // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta se có một access và refresh token mới
  // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  // Chưa đăng nhập thì cũng không cho chạy
  if (!accessToken || !refreshToken) return;
  const decodedAccessToken = decodeToken(accessToken);
  const decodedRefreshToken = decodeToken(refreshToken);
  // Thời điểm hết hạn của token là tính theo epoch time (s)
  // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
  const now = new Date().getTime() / 1000 - 1;
  // trường hợp refresh token hết hạn thì cho logout
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    return param?.onError && param.onError();
  }
  // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
  // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
  // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
  // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    // Gọi API refresh token
    try {
      const role = decodedRefreshToken.role;
      const res = role === Role.Guest ? await guestApiRequest.refreshToken() : await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};
