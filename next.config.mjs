/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Не бандлить эти пакеты, чтобы их бинарники и ресурсы остались в node_modules на сервере
    serverComponentsExternalPackages: [
      '@sparticuz/chromium',
      'puppeteer-core',
    ],
  },
};

export default nextConfig;
