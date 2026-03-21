import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    const backendBase =
      process.env.RAILWAY_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "";

    if (!backendBase.startsWith("http://") && !backendBase.startsWith("https://")) {
      return [];
    }

    return [
      {
        // Browser jab bhi '/api/:path*' hit karega...
        source: '/api/:path*',
        // ...toh Next.js usey is URL par redirect kar dega (chupke se)
        destination: `${backendBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
