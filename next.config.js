/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/images/ceph/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=31536000, public, immutable',
          },
        ],
      },
      {
        source: '/images/crust/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=31536000, public, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
