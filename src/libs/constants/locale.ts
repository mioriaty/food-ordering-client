export type Locale = (typeof locales)[number];

export const defaultLocale = 'en';
export const locales = ['en', 'vi'] as const;
