import { GuestLoginBodyType } from '@/domain/schemas/guest.schema';
import { HttpError } from '@/infrastructure/http/fetcher';
import guestService from '@/infrastructure/services/guest.service';
import { decodeToken } from '@/libs/utils/decode-token';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = (await request.json()) as GuestLoginBodyType;
  const cookieStore = await cookies();

  try {
    const { payload } = await guestService.sLogin(body);
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
