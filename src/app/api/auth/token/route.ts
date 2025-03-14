import { HttpError } from '@/infrastructure/http/fetcher';
import { decodeToken } from '@/libs/utils/decode-token';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = (await request.json()) as { accessToken: string; refreshToken: string };

  const cookieStore = cookies();

  try {
    const { accessToken, refreshToken } = body;

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

    return Response.json(body);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      });
    } else {
      return Response.json(
        {
          message: 'Có lỗi xảy ra'
        },
        {
          status: 500
        }
      );
    }
  }
}
