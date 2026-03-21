import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        // Browser jab bhi '/api/:path*' hit karega...
        source: '/api/:path*',
        // ...toh Next.js usey is URL par redirect kar dega (chupke se)
        destination: `${process.env.RAILWAY_BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;