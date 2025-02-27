/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000'
      },
      {
        hostname: 'placehold.co',
        pathname: '/**'
      }
    ]
  }
  // reactStrictMode: false
};

export default nextConfig;
