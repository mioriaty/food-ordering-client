import authService from '@/infrastructure/services/auth.service';
import { decodeToken } from '@/libs/utils/decode-token';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  const currentRefreshToken = cookieStore.get('refreshToken')?.value;

  if (!currentRefreshToken) {
    return Response.json(
      {
        message: 'Không nhận được refreshToken từ client'
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

    return Response.json(payload); // api từ server trả về cái gì thì trả về client cái đó
  } catch (error: any) {
    return Response.json(
      {
        message: error.message ?? 'Có lỗi xảy ra'
      },
      {
        status: 401
      }
    );
  }
}
