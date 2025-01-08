'use client';

import { getAccessTokenFromLocalStorage } from '@/libs/utils/local-authentication';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu',
    authRequired: false
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true
  }
];

// Server: => "Món ăn", "đăng nhập"- Do server không biết trạng thái đăng nhập của user
// Client: Đầu tiên client sẽ hiển thị là Món ăn, Đăng nhập.
// Nhưng ngay sau đố thì client render ra là Món ăn, Đơn hàng, Đăng nhập, Quản lý do đã được check trạng thái đăng nhập của user
export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()));
  }, []);

  return menuItems.map((item) => {
    if ((item.authRequired === false && isAuth) || (item.authRequired === true && !isAuth)) {
      return null;
    }

    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
