const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/:path*/', destination: '/:path*/code.html' },
      { source: '/:path*', destination: '/:path*/code.html' }
    ]
  }
}
module.exports = nextConfig
