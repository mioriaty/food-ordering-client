'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { Locale, locales } from '@/libs/constants/locale';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export const SelectLanguage = () => {
  const t = useTranslations('SelectLanguage');
  const locale = useLocale();

  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      value={locale}
      onValueChange={(value: Locale) => {
        const newPathname = pathname.replace(`/${locale}`, `/${value}`);
        const newUrl = new URL(window.location.href);
        newUrl.pathname = newPathname;
        router.replace(newUrl.toString());
      }}
    >
      <SelectTrigger className="w-fit">
        <SelectValue placeholder={t('title')} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} className="cursor-pointer" value={locale}>
            {t(locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
