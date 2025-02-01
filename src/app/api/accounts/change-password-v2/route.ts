import { ChangePasswordV2BodyType } from '@/domain/schemas/account.schema';
import { HttpError } from '@/infrastructure/http/fetcher';
import meService from '@/infrastructure/services/me.service';
import { decodeToken } from '@/libs/utils/decode-token';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
  const body = (await request.json()) as ChangePasswordV2BodyType;

  const cookieStore = cookies();
  const currentAccessToken = cookieStore.get('accessToken')?.value;

  if (!currentAccessToken) {
    return Response.json(
      {
        message: 'Không nhận được accessToken từ client'
      },
      { status: 200 }
    );
  }

  try {
    const { payload } = await meService.sChangePassword(currentAccessToken, body);

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
    if (error instanceof HttpError) {
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
