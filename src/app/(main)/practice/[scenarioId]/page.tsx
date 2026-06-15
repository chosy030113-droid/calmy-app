"use client";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { scenarios } from "@/data/scenarios";
import ScenarioIcon from "@/components/ScenarioIcon";

const levelColor = ["", "#03C75A", "#F59E0B", "#EF4444"];
const levelLabel = ["", "초급", "중급", "고급"];

export default function ScenarioLevelPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = use(params);
  const scenario = scenarios.find((s) => s.id === scenarioId);
  const { getLevelProgress } = useStore();

  if (!scenario) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>시나리오를 찾을 수 없어요.</p>
        <Link href="/practice">돌아가기</Link>
      </div>
    );
  }

  const completedLevel = getLevelProgress(scenarioId);
  const progress = (completedLevel / scenario.levels.length) * 100;

  return (
    <div style={{ background: "var(--calmy-bg-app)", minHeight: "100%" }}>
      {/* 헤더 */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "20px 20px 0",
        }}
      >
        <Link href="/practice">
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "var(--calmy-text-primary)",
            }}
          >
            <ArrowLeft size={22} />
          </button>
        </Link>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          <ScenarioIcon id={scenario.id} size={22} />
          {scenario.title}
        </h1>
      </header>

      {/* 진행도 바 */}
      <div style={{ padding: "20px 20px 0" }}>
        <div
          style={{
            background: "var(--calmy-white)",
            borderRadius: 20,
            padding: 20,
            border: "1px solid var(--calmy-border-subtle)",
            boxShadow: "var(--calmy-shadow-xs)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--calmy-neutral-700)" }}>전체 진행률</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--calmy-primary-600)" }}>
              {completedLevel} / {scenario.levels.length} 완료
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: "var(--calmy-neutral-100)",
              borderRadius: 9999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "var(--calmy-primary-600)",
                borderRadius: 9999,
                transition: "width 400ms ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* 레벨 로드맵 */}
      <div style={{ padding: "20px 20px 0" }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, color: "var(--calmy-neutral-700)" }}>
          레벨 로드맵
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {scenario.levels.map((lv, idx) => {
            const done = completedLevel >= lv.level;
            const current = completedLevel + 1 === lv.level;
            const locked = lv.level > completedLevel + 1;
            const col = levelColor[lv.level];
            const label = levelLabel[lv.level];

            return (
              <div key={lv.level} style={{ position: "relative" }}>
                {/* 연결선 */}
                {idx < scenario.levels.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 27,
                      top: "100%",
                      width: 2,
                      height: 12,
                      background: done || current ? "var(--calmy-primary-600)" : "var(--calmy-neutral-200)",
                      zIndex: 0,
                    }}
                  />
                )}

                <div
                  style={{
                    background: "var(--calmy-white)",
                    border: done
                      ? "1.5px solid var(--calmy-primary-300)"
                      : current
                      ? "2px solid var(--calmy-primary-600)"
                      : "1px solid var(--calmy-border-subtle)",
                    borderRadius: 18,
                    padding: "16px 16px 16px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    opacity: locked ? 0.4 : 1,
                    boxShadow: "none",
                  }}
                >
                  {/* 상태 아이콘 */}
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      background: done
                        ? "var(--calmy-primary-100)"
                        : "var(--calmy-neutral-100)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  >
                    {done ? (
                      <CheckCircle2 size={22} color="var(--calmy-primary-600)" />
                    ) : locked ? (
                      <Lock size={18} color="var(--calmy-neutral-300)" />
                    ) : (
                      <PlayCircle size={24} color="var(--calmy-primary-600)" strokeWidth={2} />
                    )}
                  </div>

                  {/* 레벨 정보 */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--calmy-text-primary)" }}>
                        Level {lv.level}
                      </span>
                      {/* 초급/중급/고급 배지만 레벨 색 유지 */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 9999,
                          background: `${col}22`,
                          color: col,
                        }}
                      >
                        {label}
                      </span>
                      {done && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 9999,
                            background: "var(--calmy-primary-100)",
                            color: "var(--calmy-primary-600)",
                          }}
                        >
                          완료
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--calmy-neutral-700)" }}>{lv.title}</div>
                    <div style={{ fontSize: 12, color: "var(--calmy-neutral-400)", marginTop: 2 }}>
                      {lv.turns.length}단계 대화
                    </div>
                  </div>

                  {/* 시작 버튼 */}
                  {!locked && (
                    <Link href={`/practice/${scenarioId}/sim?level=${lv.level}`}>
                      <button
                        style={{
                          padding: "9px 16px",
                          background: "var(--calmy-primary-600)",
                          color: "white",
                          border: "none",
                          borderRadius: 12,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        {done ? "재도전" : current ? "시작" : "재도전"}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: 16 }} />
    </div>
  );
}
