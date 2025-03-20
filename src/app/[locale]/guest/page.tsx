import { redirect } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export default function GuestPage() {
  const locale = useLocale();
  // Redirect to the menu page when accessing /guest directly
  redirect({ href: '/guest/menu', locale });
}
