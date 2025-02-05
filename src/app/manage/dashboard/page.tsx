import meService from '@/infrastructure/services/me.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { cookies } from 'next/headers';

import DashboardMain from '@/app/manage/dashboard/dashboard-main';

export default async function Dashboard() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value as string;
  let name = '';

  try {
    const result = await meService.sGetMe(accessToken);
    name = result.payload.data.name;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Dashboard của {name}</CardTitle>
            <CardDescription>Phân tích các chỉ số</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardMain />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
