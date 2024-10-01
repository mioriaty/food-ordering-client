import {
  AUTHENTICATION_ERROR_STATUS,
  ENTITY_ERROR_STATUS,
  EntityErrorPayload,
  RequestErrorEntity
} from '@/entities/errors/auth.entity';
import { HttpErrorEntity } from '@/entities/errors/http.entity';
import { LoginResType } from '@/entities/models/auth.model';
import { CLIENT_ENV } from '@/infrastructure/schemas/env.schema';
import { normalizePath } from '@/shared/utils/path';
import { redirect } from 'next/navigation';

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined;
};

let clientLogoutRequest: null | Promise<any> = null;
const isClient = typeof window !== 'undefined';

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
}
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json'
        };
  if (isClient) {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl = options?.baseUrl === undefined ? CLIENT_ENV.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl;

  const fullUrl = `${baseUrl}/${normalizePath(url)}`;
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    } as any,
    body,
    method
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload
  };
  // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new RequestErrorEntity(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch('/api/auth/logout', {
            method: 'POST',
            body: null, // Logout mình sẽ cho phép luôn luôn thành công
            headers: {
              ...baseHeaders
            } as any
          });
          try {
            await clientLogoutRequest;
          } catch (error) {
          } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            clientLogoutRequest = null;
            // Redirect về trang login có thể dẫn đến loop vô hạn
            // Nếu không không được xử lý đúng cách
            // Vì nếu rơi vào trường hợp tại trang Login, chúng ta có gọi các API cần access token
            // Mà access token đã bị xóa thì nó lại nhảy vào đây, và cứ thế nó sẽ bị lặp
            location.href = '/login';
          }
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization.split('Bearer ')[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    } else {
      throw new HttpErrorEntity(data);
    }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isClient) {
    const normalizeUrl = normalizePath(url);
    if (normalizeUrl === 'api/auth/login') {
      const { accessToken, refreshToken } = (payload as LoginResType).data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } else if (normalizeUrl === 'api/auth/logout') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
  return data;
};

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('GET', url, options);
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('POST', url, { ...options, body });
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PUT', url, { ...options, body });
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('DELETE', url, { ...options });
  }
};

export default http;
