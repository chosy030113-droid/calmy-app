"use client";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";

export default function ReportPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = use(params);
  const { history } = useStore();
  const record = history.find((r) => r.id === recordId);

  if (!record) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>기록을 찾을 수 없어요.</p>
        <Link href="/practice/growth">돌아가기</Link>
      </div>
    );
  }

  const scoreColor =
    record.score >= 85 ? "#03C75A" : record.score >= 70 ? "#F59E0B" : "#EF4444";

  return (
    <div style={{ background: "var(--calmy-bg-app)", minHeight: "100dvh", paddingBottom: 40, maxWidth: 390, margin: "0 auto" }}>
      {/* 헤더 */}
      <header
        style={{
          padding: "20px 16px 0",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Link href="/practice/growth">
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <ArrowLeft size={22} color="var(--calmy-text-primary)" />
          </button>
        </Link>
        <div>
          <div style={{ fontSize: 11, color: "var(--calmy-neutral-500)" }}>
            {new Date(record.date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--calmy-text-primary)" }}>
            {record.scenarioTitle} · Level {record.level}
          </div>
        </div>
      </header>

      {/* 종합 점수 */}
      <div style={{ padding: "20px 20px 0" }}>
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "24px",
            border: "1px solid var(--calmy-border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: 20,
            boxShadow: "var(--calmy-shadow-sm)",
          }}
        >
          {/* 원형 게이지 */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <svg width={90} height={90} viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="38" fill="none" stroke="var(--calmy-neutral-100)" strokeWidth="9" />
              <circle
                cx="45"
                cy="45"
                r="38"
                fill="none"
                stroke={scoreColor}
                strokeWidth="9"
                strokeDasharray={`${(record.score / 100) * 238.8} 238.8`}
                strokeLinecap="round"
                transform="rotate(-90 45 45)"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 700, color: scoreColor }}>{record.score}</span>
              <span style={{ fontSize: 10, color: "var(--calmy-neutral-400)" }}>/100</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--calmy-neutral-500)", marginBottom: 4 }}>종합 점수</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--calmy-text-primary)" }}>
              {record.score >= 85 ? "훌륭해요!" : record.score >= 70 ? "잘 했어요!" : "조금만 더!"}
            </div>
            <div style={{ fontSize: 13, color: "var(--calmy-neutral-500)", marginTop: 2 }}>
              힌트 {record.hintsUsed}회 사용
            </div>
          </div>
        </div>
      </div>

      {/* 칭찬 포인트 */}
      {record.praise.length > 0 && (
        <div style={{ padding: "14px 20px 0" }}>
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
            {record.praise.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#03C75A", flexShrink: 0, marginTop: 7 }} />
                <span style={{ fontSize: 14, color: "var(--calmy-text-primary)", lineHeight: 1.55 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 개선점 */}
      {record.improve.length > 0 && (
        <div style={{ padding: "12px 20px 0" }}>
          <div
            style={{
              background: "#EEF1FC",
              borderRadius: 18,
              padding: "18px",
              border: "1px solid var(--calmy-primary-200)",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--calmy-primary-600)", marginBottom: 12 }}>
              ✨ 다음엔 이렇게 해보세요
            </div>
            {record.improve.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--calmy-primary-400)", flexShrink: 0, marginTop: 7 }} />
                <span style={{ fontSize: 14, color: "var(--calmy-text-primary)", lineHeight: 1.55 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI 인사이트 */}
      <div style={{ padding: "12px 20px 0" }}>
        <div
          style={{
            background: "linear-gradient(135deg, var(--calmy-primary-50), white)",
            borderRadius: 18,
            padding: "16px 18px",
            border: "1px solid var(--calmy-primary-200)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--calmy-primary-600)", marginBottom: 6 }}>
            🤖 AI 인사이트
          </div>
          <div style={{ fontSize: 13, color: "var(--calmy-neutral-700)", lineHeight: 1.7 }}>
            말하기 패턴을 분석한 결과, 대화 흐름을 자연스럽게 이어가는 능력이 향상되고 있어요. 다음 레벨에 도전해 보세요!
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div style={{ padding: "24px 20px 0" }}>
        <Link href={`/practice/${record.scenarioId}`}>
          <button
            style={{
              width: "100%",
              padding: "15px",
              background: "var(--calmy-primary-600)",
              color: "white",
              border: "none",
              borderRadius: 16,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "var(--calmy-shadow-lg)",
            }}
          >
            다시 연습하기
          </button>
        </Link>
      </div>
    </div>
  );
}
