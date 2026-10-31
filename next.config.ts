import type { NextConfig } from "next";

// 🛡️ Sentinel: Hardening HTTP security headers for defense-in-depth protection
// - X-Frame-Options: Prevent clickjacking / framing attacks
// - X-Content-Type-Options: Prevent MIME-sniffing vulnerabilities
// - Referrer-Policy: Limit referrer leakage across domains
// - Permissions-Policy: Disable sensitive browser features by default
// - X-DNS-Prefetch-Control: Control DNS prefetching
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
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
