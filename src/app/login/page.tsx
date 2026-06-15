"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) return;
    router.push("/");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        background: "white",
        maxWidth: 390,
        margin: "0 auto",
        padding: "0 28px",
      }}
    >
      {/* 상단 로고 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 72,
          paddingBottom: 40,
        }}
      >
        <Image
          src="/calmy-symbol.png"
          alt="CALMY"
          width={130}
          height={107}
          style={{ objectFit: "contain" }}
          priority
        />
        <div style={{ marginTop: 10, fontSize: 13, color: "#94A3B8" }}>
          전화가 편해지는 날까지
        </div>
      </div>

      {/* 로그인 폼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>
            이메일
          </label>
          <input
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "1.5px solid #E2E8F0",
              borderRadius: 14,
              fontSize: 15,
              outline: "none",
              background: "#F8FAFC",
              boxSizing: "border-box",
              color: "#1E293B",
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>
            비밀번호
          </label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "1.5px solid #E2E8F0",
              borderRadius: 14,
              fontSize: 15,
              outline: "none",
              background: "#F8FAFC",
              boxSizing: "border-box",
              color: "#1E293B",
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          style={{
            marginTop: 6,
            width: "100%",
            padding: "16px",
            background: "#3C70FF",
            color: "white",
            border: "none",
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(60,112,255,0.35)",
          }}
        >
          로그인하기
        </button>
      </div>

      {/* 구분선 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "28px 0",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
        <span style={{ fontSize: 12, color: "#94A3B8" }}>또는</span>
        <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
      </div>

      {/* 소셜 로그인 (카카오) */}
      <button
        onClick={() => router.push("/")}
        style={{
          width: "100%",
          padding: "15px",
          background: "#FEE500",
          color: "#191919",
          border: "none",
          borderRadius: 16,
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3C7.03 3 3 6.36 3 10.5c0 2.67 1.67 5.01 4.18 6.37l-.97 3.58L10.35 18c.54.08 1.09.12 1.65.12 4.97 0 9-3.36 9-7.5S16.97 3 12 3z"
            fill="#191919"
          />
        </svg>
        카카오로 로그인
      </button>

      {/* 회원가입 링크 */}
      <div
        style={{
          marginTop: 28,
          textAlign: "center",
          fontSize: 14,
          color: "#64748B",
        }}
      >
        아직 계정이 없으신가요?{" "}
        <Link
          href="/signup"
          style={{ color: "#3C70FF", fontWeight: 700, textDecoration: "none" }}
        >
          회원가입
        </Link>
      </div>

      {/* 비밀번호 찾기 */}
      <div style={{ marginTop: 14, textAlign: "center" }}>
        <span style={{ fontSize: 13, color: "#94A3B8", cursor: "pointer" }}>
          비밀번호를 잊으셨나요?
        </span>
      </div>
    </div>
  );
}
