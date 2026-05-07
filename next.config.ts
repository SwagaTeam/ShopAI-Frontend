import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Получаем адрес бэкенда из переменных окружения
    const backendUrl = process.env.BACKEND_URL;

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;