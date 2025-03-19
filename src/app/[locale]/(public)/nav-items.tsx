'use client';

import { useLogoutMutation } from '@/infrastructure/queries/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/libs/components/ui/alert-dialog';
import { Role } from '@/libs/constants/type';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { cn } from '@/libs/utils/string';
import { RoleType } from '@/shared/types/jwt.types';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavItem {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogged?: boolean;
}

const menuItems: NavItem[] = [
  {
    title: 'home',
    href: '/'
  },
  {
    title: 'menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'orders',
    href: '/guest/orders',
    role: [Role.Guest]
  },
  {
    title: 'login',
    href: '/login',
    hideWhenLogged: true
  },
  {
    title: 'manage',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee]
  }
];

// Server: => "Món ăn", "đăng nhập"- Do server không biết trạng thái đăng nhập của user
// Client: Đầu tiên client sẽ hiển thị là Món ăn, Đăng nhập.
// Nhưng ngay sau đố thì client render ra là Món ăn, Đơn hàng, Đăng nhập, Quản lý do đã được check trạng thái đăng nhập của user
export default function NavItems({ className }: { className?: string }) {
  const role = useAuthStore((state) => state.role);
  const disconnectSocket = useAuthStore((state) => state.disconnectSocket);
  const setRole = useAuthStore((state) => state.setRole);

  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const t = useTranslations('Navigation');

  const handleLogout = async () => {
    if (logoutMutation.isPending) return;

    try {
      await logoutMutation.mutateAsync();
      setRole(undefined);
      disconnectSocket();
      router.push('/');
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <>
      {menuItems.map((item) => {
        // Trường hợp đăng nhập thì chỉ hiển thị menu đăng nhập
        const isAuth = item.role && role && item.role.includes(role);
        // Trường hợp menu item có thể hiển thị dù cho đã đăng nhập hay chưa
        const canShow = (item.role === undefined && !item.hideWhenLogged) || (!role && item.hideWhenLogged);

        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {t(item.title as any)}
            </Link>
          );
        }
        return null;
      })}

      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer')}>{t('logout')}</div>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('logoutDialog.logoutQuestion')}</AlertDialogTitle>
              <AlertDialogDescription>{t('logoutDialog.logoutConfirm')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('logoutDialog.logoutCancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>{t('logoutDialog.logoutConfirm')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
