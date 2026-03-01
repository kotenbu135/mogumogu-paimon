import type { NextConfig } from "next";

const basePath = "/mogumogu-paimon";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: {
    BASE_PATH: basePath,
  },
};

export default nextConfig;
