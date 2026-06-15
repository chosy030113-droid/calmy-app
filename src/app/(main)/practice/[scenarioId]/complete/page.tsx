"use client";
import { use } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

const CIRCUMFERENCE = 263.9; // 2 * π * 42

export default function CompletePage({
  params,
  searchParams,
}: {
  params: Promise<{ scenarioId: string }>;
  searchParams: Promise<{ score?: string; hints?: string; praise?: string; improve?: string; level?: string }>;
}) {
  const { scenarioId } = use(params);
  const { score, hints, praise: praiseStr, improve: improveStr, level } = use(searchParams);

  const scoreNum   = Number(score ?? 80);
  const hintsNum   = Number(hints ?? 0);
  const praise     = praiseStr  ? decodeURIComponent(praiseStr).split("||").filter(Boolean)  : [];
  const improve    = improveStr ? decodeURIComponent(improveStr).split("||").filter(Boolean) : [];
  const scoreColor = scoreNum >= 85 ? "#03C75A" : scoreNum >= 70 ? "#F59E0B" : "#EF4444";
  const gaugeEnd   = CIRCUMFERENCE - (scoreNum / 100) * CIRCUMFERENCE;

  return (
    <div
      style={{
        background: "var(--calmy-bg-app)",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        padding: "0 0 40px",
        maxWidth: 390,
        margin: "0 auto",
      }}
    >
      {/* ① 잘 해냈어요! 섹션 — 맨 위, compact */}
      <div
        style={{
          background: "linear-gradient(180deg, #3C70FF 0%, #517FFF 100%)",
          padding: "32px 24px 60px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 트로피 */}
        <div style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
          <div style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))" }}>
            <svg width="68" height="76" viewBox="0 0 96 106" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 6 H80 L72 52 C70 62 60 70 48 70 C36 70 26 62 24 52 Z" fill="#FFF46C"/>
              <path d="M16 6 C6 6 0 15 0 25 C0 36 7 43 18 46 L22 37 C14 35 10 31 10 25 C10 19 13 14 16 14 Z" fill="#FFF46C"/>
              <path d="M80 6 C90 6 96 15 96 25 C96 36 89 43 78 46 L74 37 C82 35 86 31 86 25 C86 19 83 14 80 14 Z" fill="#FFF46C"/>
              <rect x="43" y="70" width="10" height="18" rx="3" fill="#8DFFC3"/>
              <rect x="24" y="88" width="48" height="12" rx="6" fill="#8DFFC3"/>
              <path d="M48 20 L51 30 L62 30 L53.5 36.5 L56.5 46.5 L48 40 L39.5 46.5 L42.5 36.5 L34 30 L45 30 Z" fill="white" opacity="0.55"/>
            </svg>
          </div>
        </div>

        {/* 텍스트 */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "white", lineHeight: 1.2 }}>
            잘 해냈어요!
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", marginTop: 6 }}>
            {hintsNum === 0 ? "힌트 없이 완주했어요!" : `힌트 ${hintsNum}회 사용`}
          </div>
        </div>
      </div>

      {/* ② 종합 점수 카드 — 겹침, z-index로 앞에 노출 */}
      <div style={{ padding: "0 20px", position: "relative", zIndex: 2, marginTop: -36 }}>
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: "24px",
            border: "1px solid var(--calmy-border-subtle)",
            boxShadow: "0 -2px 16px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--calmy-neutral-500)", marginBottom: 18 }}>
            종합 점수
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* 원형 게이지 */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <svg width={100} height={100} viewBox="0 0 100 100">
                {/* 배경 트랙 */}
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--calmy-neutral-100)" strokeWidth="9" />
                {/* 채워지는 아크 */}
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={CIRCUMFERENCE}
                  transform="rotate(-90 50 50)"
                  style={
                    {
                      "--gauge-end": `${gaugeEnd}`,
                      animation: "gaugeArc 1.1s 0.35s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
                    } as React.CSSProperties
                  }
                />
              </svg>
              <div
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 26, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{scoreNum}</span>
                <span style={{ fontSize: 11, color: "var(--calmy-neutral-400)", marginTop: 2 }}>/100</span>
              </div>
            </div>

            {/* 텍스트 */}
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--calmy-text-primary)", lineHeight: 1.2 }}>
                {scoreNum >= 85 ? "훌륭해요!" : scoreNum >= 70 ? "잘 했어요!" : "조금만 더!"}
              </div>
              <div style={{ fontSize: 13, color: "var(--calmy-neutral-500)", marginTop: 8, lineHeight: 1.5 }}>
                {scoreNum >= 85
                  ? "거의 완벽한 통화였어요.\n자신감을 가져도 좋아요!"
                  : "계속 연습하면\n분명히 늘어요!"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ③ 칭찬 포인트 */}
      {praise.length > 0 && (
        <div style={{ padding: "16px 20px 0" }}>
          <div
            style={{
              background: "white",
              borderRadius: 18,
              padding: "18px",
              border: "1px solid var(--calmy-border-subtle)",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "#047a44", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={15} /> 잘한 점
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {praise.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#03C75A", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 14, color: "var(--calmy-text-primary)", lineHeight: 1.55 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ④ 개선점 */}
      {improve.length > 0 && (
        <div style={{ padding: "12px 20px 0" }}>
          <div style={{ background: "#EEF1FC", borderRadius: 18, padding: "18px", border: "1px solid var(--calmy-primary-200)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--calmy-primary-600)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1 L8.2 5.2 L12.5 5.2 L9 7.8 L10.2 12 L7 9.4 L3.8 12 L5 7.8 L1.5 5.2 L5.8 5.2 Z" fill="#3C70FF"/>
              </svg>
              다음엔 이렇게 해보세요
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {improve.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--calmy-primary-400)", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 14, color: "var(--calmy-text-primary)", lineHeight: 1.55 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ⑤ 버튼 */}
      <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href={`/practice/${scenarioId}/sim?level=${level}`}>
          <button style={{ width: "100%", padding: "15px", background: "var(--calmy-neutral-100)", color: "var(--calmy-neutral-700)", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            다시 도전하기
          </button>
        </Link>
        <Link href={`/practice/${scenarioId}`}>
          <button style={{ width: "100%", padding: "15px", background: "var(--calmy-primary-600)", color: "white", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "var(--calmy-shadow-lg)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            완료하고 저장 <ChevronRight size={16} />
          </button>
        </Link>
      </div>

      <style>{`
        @keyframes gaugeArc {
          from { stroke-dashoffset: ${CIRCUMFERENCE}; }
          to   { stroke-dashoffset: var(--gauge-end); }
        }
      `}</style>
    </div>
  );
}
