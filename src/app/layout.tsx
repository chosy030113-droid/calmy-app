import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CALMY — 콜포비아 트레이닝",
  description: "AI 시뮬레이션으로 전화 통화가 편해지는 앱",
  icons: {
    icon: "/calmy-app-icon.png",
    apple: "/calmy-app-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "CALMY",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={roboto.className}>
      <body>{children}</body>
    </html>
  );
}
