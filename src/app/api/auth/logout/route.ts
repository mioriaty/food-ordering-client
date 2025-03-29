import authService from '@/infrastructure/services/auth.service';
import { cookies } from 'next/headers';

export async function POST(_request: Request) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: 'Không nhận được accessToken hoặc refreshToken từ client'
      },
      { status: 200 }
    );
  }

  try {
    const result = await authService.sLogout({
      accessToken,
      refreshToken
    });

    return Response.json(result.payload);
  } catch (error) {
    return Response.json(
      {
        message: 'Lỗi khi gọi API đến server backend'
      },
      {
        status: 200
      }
    );
  }
}
