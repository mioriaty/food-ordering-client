import envConfig from '@/configs/env.config';

export const baseOpenGraph = {
  locale: 'en_US',
  alternateLocale: ['vi_VN'],
  type: 'website',
  siteName: 'Duong\'s Restaurant',
  images: [
    {
      url: `${envConfig.NEXT_PUBLIC_URL}/banner.png`
    }
  ]
};
