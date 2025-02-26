import { HttpError } from '@/infrastructure/http/fetcher';
import guestService from '@/infrastructure/services/guest.service';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(_request: Request) {
  const cookieStore = cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      {
        message: 'Không nhận được accessToken hoặc refreshToken từ client'
      },
      { status: 200 }
    );
  }

  try {
    const result = await guestService.sLogout({
      accessToken,
      refreshToken
    });

    return NextResponse.json(result.payload);
  } catch (error) {
    handleErrorApi({ error, duration: 5000 });
    if (error instanceof HttpError) {
      return NextResponse.json(error.message, {
        // status: error.status,
        status: 200
      });
    } else {
      return NextResponse.json({
        status: 200,
        message: 'Lỗi gì đó từ server'
      });
    }
  }
}
