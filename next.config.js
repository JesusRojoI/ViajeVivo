/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16 (Turbopack): evita que se busque el lockfile fuera del proyecto.
  // Las imágenes se sirven desde /public/images, así que no hacen falta remotePatterns.
  turbopack: { root: __dirname },
};

module.exports = nextConfig;
