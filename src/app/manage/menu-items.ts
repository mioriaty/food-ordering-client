import { Role } from '@/libs/constants/type';
import { Home, Salad, ShoppingCart, Table2, Users2 } from 'lucide-react';

interface MenuItem {
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  href: string;
  role?: (typeof Role)[keyof typeof Role][];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    Icon: Home,
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee]
  },
  {
    title: 'Đơn hàng',
    Icon: ShoppingCart,
    href: '/manage/orders',
    role: [Role.Owner, Role.Employee]
  },
  {
    title: 'Bàn ăn',
    Icon: Table2,
    href: '/manage/tables',
    role: [Role.Owner, Role.Employee]
  },
  {
    title: 'Món ăn',
    Icon: Salad,
    href: '/manage/dishes',
    role: [Role.Owner, Role.Employee]
  },
  // {
  //   title: 'Phân tích',
  //   Icon: LineChart,
  //   href: '/manage/analytics'
  // },
  {
    title: 'Nhân viên',
    Icon: Users2,
    href: '/manage/accounts',
    role: [Role.Owner]
  }
];

export default menuItems;
