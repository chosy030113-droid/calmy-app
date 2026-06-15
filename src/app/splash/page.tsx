"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      const done = localStorage.getItem("calmy-onboarded");
      router.push(done ? "/" : "/onboarding");
    }, 2400);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
        background: "#3C70FF",
        maxWidth: 390,
        margin: "0 auto",
        gap: 28,
      }}
    >
      {/* 심볼 */}
      <div
        style={{
          animation: "splashPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <img
          src="/calmy-splash-symbol.svg"
          alt="CALMY 심볼"
          width={220}
          height={190}
          style={{ display: "block" }}
        />
      </div>

      {/* 로고타입 */}
      <div
        style={{
          animation: "splashFadeUp 0.5s 0.35s both",
        }}
      >
        <img
          src="/calmy-logotype-white.svg"
          alt="CALMY"
          width={160}
          height={34}
          style={{ display: "block" }}
        />
      </div>

      {/* 태그라인 */}
      <div
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.65)",
          letterSpacing: "0.02em",
          animation: "splashFadeUp 0.5s 0.5s both",
          marginTop: -12,
        }}
      >
        전화가 편해지는 날까지
      </div>

      <style>{`
        @keyframes splashPop {
          from { opacity: 0; transform: scale(0.75); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
