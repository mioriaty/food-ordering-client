'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { Locale } from '@/libs/constants/locale';
import { useLocale, useTranslations } from 'next-intl';

export const SelectLanguage = () => {
  const t = useTranslations('SelectLanguage');
  const locale = useLocale();

  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      value={locale}
      onValueChange={(value: Locale) => {
        router.replace(pathname, {
          locale: value
        });
        router.refresh();
      }}
    >
      <SelectTrigger className="w-fit">
        <SelectValue placeholder={t('title')} />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((locale) => (
          <SelectItem key={locale} className="cursor-pointer" value={locale}>
            {t(locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
