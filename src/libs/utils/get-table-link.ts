import envConfig from '@/configs/env.config';
import { defaultLocale } from '@/libs/constants/locale';

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return `${envConfig.NEXT_PUBLIC_URL}/${defaultLocale}/tables/${tableNumber}?token=${token}`;
};
