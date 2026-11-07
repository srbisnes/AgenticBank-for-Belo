import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking by disallowing framing
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent browsers from MIME-sniffing away from the declared Content-Type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Restrict referrer information leaked to external domains
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable access to sensitive browser features by default
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Cross-site scripting filter protection for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
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
