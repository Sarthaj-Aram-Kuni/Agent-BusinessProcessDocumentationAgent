import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove X-Powered-By header
  poweredByHeader: false,

  // Strict mode catches subtle React bugs in development
  reactStrictMode: true,

  // Security headers for production
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
