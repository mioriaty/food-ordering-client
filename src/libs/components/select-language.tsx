'use client';

import { setUserLocale } from '@/infrastructure/services/locale.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { Locale, locales } from '@/libs/constants/locale';
import { useLocale, useTranslations } from 'next-intl';

export const SelectLanguage = () => {
  const t = useTranslations('SelectLanguage');
  const locale = useLocale();

  return (
    <Select
      value={locale}
      onValueChange={(value: Locale) => {
        setUserLocale(value);
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
