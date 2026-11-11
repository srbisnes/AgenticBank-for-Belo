import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking attacks by forbidding iframe embedding
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing vulnerabilities
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control referrer information sent in HTTP requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable access to sensitive browser features by default
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Enable XSS filter in browsers that support it
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
