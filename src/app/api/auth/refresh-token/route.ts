import { HttpError } from '@/infrastructure/http/fetcher';
import authService from '@/infrastructure/services/auth.service';
import { decodeToken } from '@/libs/utils/decode-token';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();
  const currentRefreshToken = cookieStore.get('refreshToken')?.value;

  if (!currentRefreshToken) {
    return NextResponse.json(
      {
        message: 'Không nhận được accessToken hoặc refreshToken từ client'
      },
      { status: 401 }
    );
  }

  try {
    const { payload } = await authService.sRefreshToken({ refreshToken: currentRefreshToken });
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

    return NextResponse.json(payload); // api từ server trả về cái gì thì trả về client cái đó
  } catch (error) {
    if (error instanceof HttpError) {
      handleErrorApi({ error, duration: 5000 });
      return NextResponse.json(error.message, {
        status: error.status
      });
    } else {
      return NextResponse.json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
}
