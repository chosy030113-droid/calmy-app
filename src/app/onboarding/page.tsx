"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";

const SLIDES = [
  {
    illustration: "logo" as const,
    badge: "안녕하세요!",
    title: "CALMY와\n함께해요",
    desc: "전화 통화가 두렵지 않도록\nAI 친구가 곁에서 함께 연습해요",
  },
  {
    illustration: "practice" as const,
    badge: "AI 시뮬레이션",
    title: "실제 같은\n통화 연습",
    desc: "카페 주문, 병원 예약 등\n다양한 상황을 미리 경험해요",
  },
  {
    illustration: "growth" as const,
    badge: "성장 기록",
    title: "성장하는 나를\n확인해요",
    desc: "매일 연습할수록 점수가 오르고\n통화에 자신감이 생겨요",
  },
];

function Illustration({ type }: { type: (typeof SLIDES)[number]["illustration"] }) {
  if (type === "logo") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <img
          src="/calmy-symbol.png"
          alt="CALMY 심볼"
          width={200}
          height={164}
          style={{ display: "block", objectFit: "contain" }}
        />
      </div>
    );
  }

  if (type === "practice") {
    return (
      <div style={{ position: "relative", width: 260, height: 210 }}>
        {/* 폰 */}
        <div
          style={{
            width: 92,
            height: 158,
            background: "white",
            borderRadius: 22,
            border: "2.5px solid #3C70FF",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 28px rgba(60,112,255,0.18)",
          }}
        >
          <Phone size={36} color="#3C70FF" strokeWidth={1.8} />
        </div>
        {/* 사용자 말풍선 */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 2,
            background: "#3C70FF",
            color: "white",
            padding: "8px 12px",
            borderRadius: "12px 12px 2px 12px",
            fontSize: 11,
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(60,112,255,0.3)",
          }}
        >
          아이스 아메리카노 주세요!
        </div>
        {/* AI 말풍선 */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 2,
            background: "white",
            color: "#334155",
            padding: "8px 12px",
            borderRadius: "12px 12px 12px 2px",
            fontSize: 11,
            fontWeight: 500,
            whiteSpace: "nowrap",
            border: "1.5px solid #E2E8F0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          네, 잠시만요!
        </div>
        {/* 힌트 뱃지 — 민트 포인트 */}
        <div
          style={{
            position: "absolute",
            top: 70,
            left: 6,
            background: "#8DFFC3",
            color: "#047a44",
            padding: "5px 10px",
            borderRadius: 9999,
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ display:"inline",verticalAlign:"middle",marginRight:4 }}>
              <path d="M12 2a7 7 0 0 1 4 12.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26A7 7 0 0 1 12 2z" fill="#047a44"/>
              <rect x="9" y="19" width="6" height="2" rx="1" fill="#047a44"/>
            </svg>
            힌트 보기
        </div>
      </div>
    );
  }

  /* growth */
  const bars = [42, 58, 52, 71, 68, 84, 92];
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  return (
    <div style={{ width: 256, display: "flex", flexDirection: "column", gap: 10 }}>
      {/* 연속 달성 칩 — 노랑 포인트 */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            background: "#FFF46C",
            color: "#7a6800",
            padding: "6px 14px",
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ display:"inline",verticalAlign:"middle",marginRight:5 }}>
              <path d="M12 2C12 2 7 8 7 13a5 5 0 0 0 10 0C17 8 12 2 12 2z" fill="#F59E0B"/>
              <path d="M12 10c0 0-2 3-2 4.5a2 2 0 0 0 4 0C14 13 12 10 12 10z" fill="#FFF46C"/>
            </svg>
            7일 연속 달성!
        </div>
      </div>
      {/* 바 차트 */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "14px 12px 10px",
          border: "1.5px solid #E2E8F0",
          boxShadow: "0 4px 16px rgba(60,112,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 80 }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${(h / 100) * 62}px`,
                  borderRadius: "5px 5px 0 0",
                  background: i === 6 ? "#3C70FF" : "rgba(60,112,255,0.2)",
                }}
              />
              <span style={{ fontSize: 9, color: "#94A3B8" }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
      {/* 평균 점수 */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1.5px solid #E2E8F0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <span style={{ fontSize: 12, color: "#64748B" }}>이번 주 평균 점수</span>
        <span style={{ fontSize: 17, fontWeight: 700, color: "#3C70FF" }}>81점 ↑</span>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [slide, setSlide] = useState(0);

  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  const next = () => {
    if (isLast) router.push("/login");
    else setSlide((s) => s + 1);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        background: "#EEF1FC",
        maxWidth: 390,
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {/* 건너뛰기 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "20px 24px 0",
          flexShrink: 0,
        }}
      >
        {!isLast && (
          <button
            onClick={() => router.push("/login")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              color: "#3C70FF",
              fontWeight: 500,
              padding: "4px 0",
              opacity: 0.6,
            }}
          >
            건너뛰기
          </button>
        )}
      </div>

      {/* 일러스트 영역 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
        }}
      >
        <Illustration type={current.illustration} />
      </div>

      {/* 텍스트 + 컨트롤 — 흰 카드 */}
      <div
        style={{
          flexShrink: 0,
          background: "white",
          borderRadius: "28px 28px 0 0",
          padding: "28px 28px 44px",
          boxShadow: "0 -4px 24px rgba(60,112,255,0.1)",
        }}
      >
        {/* 배지 */}
        <div
          style={{
            display: "inline-block",
            background: "#EEF1FC",
            color: "#3C70FF",
            fontSize: 12,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 9999,
            marginBottom: 12,
          }}
        >
          {current.badge}
        </div>

        {/* 타이틀 */}
        <h1
          style={{
            margin: "0 0 10px",
            fontSize: 26,
            fontWeight: 800,
            color: "#1E293B",
            lineHeight: 1.3,
            whiteSpace: "pre-line",
          }}
        >
          {current.title}
        </h1>

        {/* 설명 */}
        <p
          style={{
            margin: "0 0 28px",
            fontSize: 15,
            color: "#64748B",
            lineHeight: 1.7,
            whiteSpace: "pre-line",
          }}
        >
          {current.desc}
        </p>

        {/* 도트 인디케이터 */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? 22 : 8,
                height: 8,
                borderRadius: 9999,
                background: i === slide ? "#3C70FF" : "rgba(60,112,255,0.18)",
                transition: "width 300ms ease, background 300ms ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* 다음 / 시작하기 버튼 */}
        <button
          onClick={next}
          style={{
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
          {isLast ? "CALMY 시작하기" : "다음"}
        </button>

        {/* 마지막 슬라이드: 회원가입 */}
        {isLast && (
          <button
            onClick={() => router.push("/signup")}
            style={{
              width: "100%",
              marginTop: 10,
              padding: "16px",
              background: "white",
              color: "#3C70FF",
              border: "2px solid #3C70FF",
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            회원가입
          </button>
        )}
      </div>
    </div>
  );
}
