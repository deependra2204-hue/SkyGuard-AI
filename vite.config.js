import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "SkyGuard AI",
        short_name: "SkyGuard AI",
        description:
          "AI-Powered AWS Data Quality and Anomaly Monitoring Dashboard",
        theme_color: "#0B2545",
        background_color: "#F3F5F7",
        display: "standalone",
        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },

      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}",
        ],

        navigateFallback: "/index.html",
      },
    }),
  ],
});