import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'api-bigboy.duthanhduoc.com',
        pathname: '/**'
      },
      {
        hostname: 'localhost',
        pathname: '/**'
      },
      {
        hostname: 'placehold.co',
        pathname: '/**'
      },
      {
        hostname: 'api.lazycatdiary.com',
        pathname: '/**'
      }
    ]
  }
};

// const withBundleAnalyzer = NextBundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true'
// });
// export default withBundleAnalyzer(withNextIntl(nextConfig));

export default withNextIntl(nextConfig);
