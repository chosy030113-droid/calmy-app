"use client";
import { Bell, ChevronRight, User, BarChart2, Shield } from "lucide-react";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function MyPage() {
  const { nickname, anxietyType, history } = useStore();

  const menuItems = [
    { icon: <User size={18} />, label: "프로필 설정", sub: nickname || "닉네임 미설정", href: "/mypage/profile" },
    { icon: <Bell size={18} />, label: "알림 설정", sub: "매일 오후 8시", href: "/mypage/notifications" },
    { icon: <BarChart2 size={18} />, label: "성장 그래프", sub: `총 ${history.length}회 완료`, href: "/practice/growth" },
    { icon: <Shield size={18} />, label: "개인정보 처리방침", sub: "", href: "#" },
  ];

  return (
    <div style={{ background: "var(--calmy-bg-app)", minHeight: "100%" }}>
      {/* 프로필 헤더 */}
      <div
        style={{
          background: "linear-gradient(180deg, var(--calmy-primary-600) 0%, #517FFF 100%)",
          padding: "32px 24px 40px",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* 프로필 아바타 — 노란 원 + 캐릭터 눈·주근깨 */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid white",
            flexShrink: 0,
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="47 80 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 노란 배경 — 전체 커버 */}
            <rect x="0" y="0" width="200" height="300" fill="#FFF46C" />
            {/* 흰 눈 영역 */}
            <path d="M102.123 124.123C108.777 113.978 120.554 109.659 129.348 114.486C138.701 119.62 141.138 133.158 134.79 144.723C128.442 156.288 115.713 161.502 106.359 156.368C102.585 154.296 99.9372 150.855 98.5382 146.728C91.885 156.874 80.1088 161.195 71.3146 156.368C61.9609 151.233 59.5242 137.696 65.8722 126.13C72.2203 114.565 84.9491 109.352 94.3028 114.486C98.0766 116.557 100.724 119.997 102.123 124.123Z" fill="#FAFDFD" />
            {/* 왼쪽 눈동자 */}
            <ellipse cx="74.9041" cy="140.232" rx="9.41988" ry="11.6471" transform="rotate(28.7626 74.9041 140.232)" fill="#3C70FF" />
            {/* 오른쪽 눈동자 */}
            <ellipse cx="110.185" cy="140.232" rx="9.41988" ry="11.6471" transform="rotate(28.7626 110.185 140.232)" fill="#3C70FF" />
            {/* 주근깨 3개 — 오른쪽 볼 */}
            <ellipse cx="123.2" cy="159.5" rx="2.08759" ry="2.58117" transform="rotate(28.7626 123.2 159.5)" fill="#3C70FF" />
            <ellipse cx="129.4" cy="166.9" rx="2.08759" ry="2.58117" transform="rotate(28.7626 129.4 166.9)" fill="#3C70FF" />
            <ellipse cx="136.1" cy="159.5" rx="2.08759" ry="2.58117" transform="rotate(28.7626 136.1 159.5)" fill="#3C70FF" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "white" }}>
            {nickname || "닉네임을 설정해요"}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 3 }}>
            {anxietyType || "불안 유형 미설정"}
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <div style={{ padding: "0 20px", marginTop: -16 }}>
        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid var(--calmy-border-subtle)",
            overflow: "hidden",
            boxShadow: "var(--calmy-shadow-sm)",
          }}
        >
          {menuItems.map(({ icon, label, sub, href }, i) => (
            <Link key={i} href={href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 18px",
                  borderBottom: i < menuItems.length - 1 ? "1px solid var(--calmy-border-subtle)" : "none",
                  color: "var(--calmy-text-primary)",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "var(--calmy-primary-50)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--calmy-primary-600)",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
                  {sub && <div style={{ fontSize: 12, color: "var(--calmy-neutral-500)", marginTop: 1 }}>{sub}</div>}
                </div>
                <ChevronRight size={16} color="var(--calmy-neutral-400)" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 20px 0", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "var(--calmy-neutral-400)" }}>CALMY v1.0 · 전화가 편해지는 날까지</div>
      </div>
    </div>
  );
}
