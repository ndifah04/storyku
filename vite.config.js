import { defineConfig } from "vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base : "",
  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "src", "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    VitePWA({
      strategies: "injectManifest",
      srcDir: "scripts/utils",
      filename: "sw.js",
      devOptions : {
        enabled: true,
        type: "module",
      },
      includeAssets: ["favicon.svg", "images/logo.png", "robots.txt"],
      manifest: {
        name: "Storyku",
        short_name: "storyku",
        description: "Difah",
        theme_color: "#ffffff",
        icons: [
          {
            src: "images/logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        navigateFallback: "index.html",
        runtimeCaching: [
          {
            // This will match any request that starts with `https://story-api.dicoding.dev/v1`
            urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\//, // The base URL pattern
            handler: "NetworkFirst", // Use the NetworkFirst strategy
            options: {
              cacheName: "api-cache", // Name the cache
              expiration: {
                maxEntries: 50, // Limit to 50 entries in the cache
                maxAgeSeconds: 60 * 60 * 24, // Cache for 1 day (24 hours)
              },
              cacheableResponse: {
                statuses: [0, 200], // Only cache responses with status 0 or 200
              },
            },
          },
        ],
        
      },
    }),
  ],
});
