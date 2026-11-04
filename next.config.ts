import type { NextConfig } from "next";

// Security headers to enforce browser protections and defense in depth
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" }, // Prevent clickjacking
  { key: "X-Content-Type-Options", value: "nosniff" }, // Prevent MIME-type sniffing
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }, // Control referrer leakage
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }, // Restrict sensitive device APIs
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; connect-src 'self' https://api.belo.app https://api.groq.com; frame-ancestors 'none';",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
