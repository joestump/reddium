/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['a.thumbs.redditmedia.com', 'b.thumbs.redditmedia.com'],
    loader: 'custom',
    loaderFile: './lib/imageLoader.ts',
  },
  publicRuntimeConfig: {
    // Set defaults
    REDDIUM_DISABLE_ABOUT: true,
    REDDIUM_DISABLE_KOFI_LINK: true,
    // Overwrite with any REDDIUM_ environment variables
    ...Object.fromEntries(
      Object.entries(process.env)
        .filter(([key]) => key.startsWith('REDDIUM_'))
    ),
  },
  eslint: {
    dirs: ['pages', 'components', 'lib', 'src'],
    ignoreDuringBuilds: false,
  },
};

// Check for required environment variables
const requiredEnvVars = ['REDDIUM_CLIENT_ID', 'REDDIUM_CLIENT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`😢 Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

module.exports = nextConfig;
