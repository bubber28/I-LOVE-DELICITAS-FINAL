const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/:rota', destination: '/rota?rota=:rota' }
    ]
  }
}
module.exports = nextConfig
