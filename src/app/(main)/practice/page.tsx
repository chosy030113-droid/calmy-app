"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Lock, LockOpen, CheckCircle2, PlayCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { scenarios } from "@/data/scenarios";
import ScenarioIcon from "@/components/ScenarioIcon";

const LEVELS = ["전체", "초급", "중급", "고급"] as const;
type LevelFilter = (typeof LEVELS)[number];

const levelIndex: Record<LevelFilter, number> = { 전체: 0, 초급: 1, 중급: 2, 고급: 3 };
const levelColor: Record<number, string> = { 1: "#03C75A", 2: "#F59E0B", 3: "#EF4444" };
const levelLabel: Record<number, string> = { 1: "초급", 2: "중급", 3: "고급" };

export default function PracticePage() {
  const [tab, setTab] = useState<"scenario" | "growth">("scenario");
  const [filter, setFilter] = useState<LevelFilter>("전체");
  const { getLevelProgress } = useStore();

  return (
    <div style={{ background: "var(--calmy-bg-app)", minHeight: "100%" }}>
      {/* 헤더 */}
      <header style={{ padding: "20px 20px 0" }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>연습하기</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--calmy-neutral-500)" }}>
          작은 연습이 쌓여 통화 자신감이 생겨요
        </p>
      </header>

      {/* 세그먼트 탭 */}
      <div style={{ display: "flex", margin: "16px 20px 0", background: "var(--calmy-neutral-100)", borderRadius: 12, padding: 4 }}>
        {(["scenario", "growth"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              if (t === "growth") window.location.href = "/practice/growth";
              else setTab(t);
            }}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              background: tab === t ? "white" : "transparent",
              color: tab === t ? "var(--calmy-primary-600)" : "var(--calmy-neutral-500)",
              boxShadow: tab === t ? "var(--calmy-shadow-xs)" : "none",
              transition: "all 150ms",
            }}
          >
            {t === "scenario" ? "시나리오 연습" : "성장 기록"}
          </button>
        ))}
      </div>

      {/* 난이도 필터 */}
      <div style={{ display: "flex", gap: 8, padding: "16px 20px 0", overflowX: "auto" }}>
        {LEVELS.map((lv) => (
          <button
            key={lv}
            onClick={() => setFilter(lv)}
            style={{
              flexShrink: 0,
              padding: "7px 16px",
              borderRadius: 9999,
              border: filter === lv ? "none" : "1px solid var(--calmy-border)",
              background: filter === lv ? "var(--calmy-primary-600)" : "white",
              color: filter === lv ? "white" : "var(--calmy-neutral-700)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 150ms",
            }}
          >
            {lv}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filter === "전체" ? (
          /* ── 전체: 시나리오 카드 (레벨 로드맵 포함) ── */
          scenarios.map((scenario) => {
            const completedLevel = getLevelProgress(scenario.id);
            return (
              <div
                key={scenario.id}
                style={{
                  background: "var(--calmy-white)",
                  borderRadius: 20,
                  border: "1px solid var(--calmy-border-subtle)",
                  overflow: "hidden",
                  boxShadow: "var(--calmy-shadow-xs)",
                }}
              >
                {/* 카드 헤더 */}
                <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: "var(--calmy-primary-50)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ScenarioIcon id={scenario.id} size={28} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--calmy-text-primary)" }}>
                      {scenario.title}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--calmy-neutral-500)", marginTop: 3 }}>
                      {completedLevel > 0 ? `${completedLevel}단계 완료` : "아직 시작 전"}
                      {" · "}총 {scenario.levels.length}단계
                    </div>
                  </div>
                  <Link href={`/practice/${scenario.id}`}>
                    <ChevronRight size={20} color="var(--calmy-neutral-400)" />
                  </Link>
                </div>

                {/* 레벨 미니 로드맵 */}
                <div style={{ padding: "0 18px 14px", display: "flex", gap: 6 }}>
                  {scenario.levels.map((lv) => {
                    const done = completedLevel >= lv.level;
                    const current = completedLevel + 1 === lv.level;
                    const locked = lv.level > completedLevel + 1;
                    const col = levelColor[lv.level];
                    return (
                      <div
                        key={lv.level}
                        style={{
                          flex: 1,
                          background: done ? `${col}10` : "var(--calmy-neutral-100)",
                          borderRadius: 10,
                          padding: "8px 0",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 4,
                          border: done
                            ? `1.5px solid ${col}`
                            : current
                            ? "1.5px solid var(--calmy-border)"
                            : "1.5px solid transparent",
                          opacity: locked ? 0.4 : 1,
                        }}
                      >
                        {done ? (
                          <CheckCircle2 size={16} color={col} />
                        ) : locked ? (
                          <Lock size={14} color="var(--calmy-neutral-300)" />
                        ) : (
                          <LockOpen size={15} color="var(--calmy-neutral-400)" strokeWidth={2} />
                        )}
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: done ? col : current ? "var(--calmy-neutral-600)" : "var(--calmy-neutral-400)",
                          }}
                        >
                          {levelLabel[lv.level]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* 시작 버튼 */}
                <div style={{ padding: "0 18px 18px" }}>
                  <Link href={`/practice/${scenario.id}`}>
                    <button
                      style={{
                        width: "100%",
                        padding: "13px",
                        background: "var(--calmy-primary-600)",
                        color: "white",
                        border: "none",
                        borderRadius: 14,
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {completedLevel > 0 ? "이어서 연습하기" : "연습 시작하기"}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          /* ── 초급/중급/고급: 해당 레벨 개별 카드 ── */
          scenarios.map((scenario) => {
            const targetLevel = levelIndex[filter];
            const lv = scenario.levels.find((l) => l.level === targetLevel);
            if (!lv) return null;

            const completedLevel = getLevelProgress(scenario.id);
            const done = completedLevel >= lv.level;
            const locked = lv.level > completedLevel + 1;
            const col = levelColor[lv.level];

            return (
              <div
                key={`${scenario.id}-${lv.level}`}
                style={{
                  background: "var(--calmy-white)",
                  borderRadius: 20,
                  border: done
                    ? "1.5px solid var(--calmy-primary-300)"
                    : locked
                    ? "1px solid var(--calmy-border-subtle)"
                    : "2px solid var(--calmy-primary-600)",
                  overflow: "hidden",
                  boxShadow: "var(--calmy-shadow-xs)",
                  opacity: locked ? 0.55 : 1,
                }}
              >
                <div style={{ padding: "18px 18px 16px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                  {/* 아이콘 */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: done ? "var(--calmy-primary-50)" : "var(--calmy-primary-50)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ScenarioIcon id={scenario.id} size={28} />
                  </div>

                  {/* 텍스트 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* 시나리오명 + 뱃지 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: "var(--calmy-neutral-500)", fontWeight: 500 }}>
                        {scenario.title}
                      </span>
                      {/* 초급/중급/고급 배지만 레벨 색 유지 */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 9999,
                          background: `${col}20`,
                          color: col,
                          flexShrink: 0,
                        }}
                      >
                        {levelLabel[lv.level]}
                      </span>
                      {done && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 9999,
                            background: "var(--calmy-primary-50)",
                            color: "var(--calmy-primary-600)",
                            flexShrink: 0,
                          }}
                        >
                          완료 ✓
                        </span>
                      )}
                    </div>

                    {/* 레벨 제목 */}
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--calmy-text-primary)", marginBottom: 4 }}>
                      {lv.title}
                    </div>

                    {/* 대화 수 */}
                    <div style={{ fontSize: 12, color: "var(--calmy-neutral-400)" }}>
                      {lv.turns.length}단계 대화
                    </div>
                  </div>

                  {/* 상태 아이콘 */}
                  <div style={{ flexShrink: 0, paddingTop: 2 }}>
                    {done ? (
                      <CheckCircle2 size={22} color="var(--calmy-primary-600)" />
                    ) : locked ? (
                      <Lock size={20} color="var(--calmy-neutral-300)" />
                    ) : (
                      <PlayCircle size={22} color="var(--calmy-primary-600)" />
                    )}
                  </div>
                </div>

                {/* 시작 버튼 */}
                {!locked && (
                  <div style={{ padding: "0 18px 18px" }}>
                    <Link href={`/practice/${scenario.id}/sim?level=${lv.level}`}>
                      <button
                        style={{
                          width: "100%",
                          padding: "13px",
                          background: done ? "var(--calmy-neutral-100)" : "var(--calmy-primary-600)",
                          color: done ? "var(--calmy-neutral-700)" : "white",
                          border: "none",
                          borderRadius: 14,
                          fontSize: 15,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {done ? "다시 연습하기" : "바로 시작하기"}
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
