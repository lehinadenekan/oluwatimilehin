/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.scdn.co'],
  },
  async redirects() {
    return [
      {
        source: '/yoruba-deck',
        destination: '/yorubadeck',
        permanent: true,
      },
      {
        source: '/yoruba-deck/:path*',
        destination: '/yorubadeck/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

