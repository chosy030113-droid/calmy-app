import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CALMY — 콜포비아 트레이닝",
    short_name: "CALMY",
    description: "AI 시뮬레이션으로 전화 통화가 편해지는 앱",
    start_url: "/splash",
    display: "standalone",
    background_color: "#F5F7FF",
    theme_color: "#3C70FF",
    orientation: "portrait",
    icons: [
      {
        src: "/calmy-app-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/calmy-app-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/calmy-app-icon.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
