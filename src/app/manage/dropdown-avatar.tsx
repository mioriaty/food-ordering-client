'use client';

import { useLoginMutation, useLogoutMutation } from '@/infrastructure/queries/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/libs/components/ui/avatar';
import { Button } from '@/libs/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/libs/components/ui/dropdown-menu';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const account = {
  name: 'Nguyễn Văn A',
  avatar: 'https://i.pravatar.cc/150'
};

export default function DropdownAvatar() {
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    if (logoutMutation.isPending) return;

    try {
      await logoutMutation.mutateAsync();
      router.push('/');
    } catch (error) {
      const _error = error as Error;
      handleErrorApi({ error: _error });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
          <Avatar>
            <AvatarImage src={account.avatar ?? undefined} alt={account.name} />
            <AvatarFallback>{account.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{account.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={'/manage/setting'} className="cursor-pointer">
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
