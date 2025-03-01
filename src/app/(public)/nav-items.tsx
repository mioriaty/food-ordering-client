'use client';

import { useAuthContext } from '@/contexts/auth-context';
import { useLogoutMutation } from '@/infrastructure/queries/useAuth';
import { Role } from '@/libs/constants/type';
import { handleErrorApi } from '@/libs/utils/handle-api-error';
import { cn } from '@/libs/utils/string';
import { RoleType } from '@/shared/types/jwt.types';
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
    title: 'Trang chủ',
    href: '/'
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'Đơn hàng',
    href: '/guest/orders',
    role: [Role.Guest]
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hideWhenLogged: true
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee]
  }
];

// Server: => "Món ăn", "đăng nhập"- Do server không biết trạng thái đăng nhập của user
// Client: Đầu tiên client sẽ hiển thị là Món ăn, Đăng nhập.
// Nhưng ngay sau đố thì client render ra là Món ăn, Đơn hàng, Đăng nhập, Quản lý do đã được check trạng thái đăng nhập của user
export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAuthContext();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    if (logoutMutation.isPending) return;

    try {
      await logoutMutation.mutateAsync();
      setRole(undefined);
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
              {item.title}
            </Link>
          );
        }

        return null;
      })}

      {role && (
        <div className={cn(className, 'cursor-pointer')} onClick={handleLogout}>
          Đăng xuất
        </div>
      )}
    </>
  );
}
