import { HttpErrorEntity } from '@/entities/errors/http.entity';
import { LoginBodyType } from '@/entities/models/auth.model';
import authApiRequest from '@/infrastructure/api-requests/auth.reuqest';
import { handleErrorApi } from '@/shared/utils/api-handlers';
import { decodeToken } from '@/shared/utils/auth-handlers';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = cookies();

  try {
    const { payload } = await authApiRequest.sLogin(body);
    const { accessToken, refreshToken } = payload.data;

    const decodedAccessToken = decodeToken(accessToken);
    const decodedRefreshToken = decodeToken(refreshToken);

    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000
    });

    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000
    });

    return Response.json(payload); // api từ server trả về cái gì thì trả về client cái đó
  } catch (error) {
    if (error instanceof HttpErrorEntity) {
      handleErrorApi({ error, duration: 5000 });
      return Response.json(error.message, {
        status: error.status
      });
    } else {
      return Response.json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
}
