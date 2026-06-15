"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, ChevronUp, TrendingUp, ArrowUp } from "lucide-react";
import { useStore } from "@/lib/store";
import MascotMint from "@/components/MascotMint";

function getDateLabel(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "오늘";
  if (date.toDateString() === yesterday.toDateString()) return "어제";
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
}

export default function GrowthPage() {
  const { history, streakDays } = useStore();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollParentRef = useRef<Element | null>(null);

  const totalCount = history.length;
  const avgScore =
    totalCount > 0
      ? Math.round(history.reduce((s, r) => s + r.score, 0) / totalCount)
      : 0;

  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
  const weekScores = [62, 70, 75, 68, 82, avgScore || 80, 0];
  // getDay(): 0=일,1=월,...,6=토 → dayNames 인덱스(월=0~일=6)로 변환
  const todayIdx = (new Date().getDay() + 6) % 7;

  // 날짜별 그룹화
  const grouped: { dateKey: string; label: string; records: typeof history }[] = [];
  for (const record of history) {
    const dateKey = record.date.slice(0, 10);
    const label = getDateLabel(record.date);
    const existing = grouped.find((g) => g.dateKey === dateKey);
    if (existing) {
      existing.records.push(record);
    } else {
      grouped.push({ dateKey, label, records: [record] });
    }
  }

  // 스크롤 감지 → 맨 위로 버튼 표시
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // 실제 스크롤 부모 탐색
    let parent: Element | null = el.parentElement;
    while (parent) {
      const { overflowY } = getComputedStyle(parent);
      if (overflowY === "auto" || overflowY === "scroll") {
        scrollParentRef.current = parent;
        break;
      }
      parent = parent.parentElement;
    }

    const scrollEl = scrollParentRef.current;
    if (!scrollEl) return;
    const onScroll = () => setShowScrollTop(scrollEl.scrollTop > 50);
    scrollEl.addEventListener("scroll", onScroll);
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    scrollParentRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  const toggleGroup = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div ref={containerRef} style={{ background: "var(--calmy-bg-app)", minHeight: "100%" }}>
      {/* 헤더 */}
      <header style={{ padding: "20px 20px 0" }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>성장 기록</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--calmy-neutral-500)" }}>
          꾸준히 연습할수록 통화가 편해져요
        </p>
      </header>

      {/* 세그먼트 탭 */}
      <div style={{ display: "flex", margin: "16px 20px 0", background: "var(--calmy-neutral-100)", borderRadius: 12, padding: 4 }}>
        <Link href="/practice" style={{ flex: 1, textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: "10px 0",
              border: "none",
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              background: "transparent",
              color: "var(--calmy-neutral-500)",
            }}
          >
            시나리오 연습
          </button>
        </Link>
        <button
          style={{
            flex: 1,
            padding: "10px 0",
            border: "none",
            borderRadius: 9,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            background: "white",
            color: "var(--calmy-primary-600)",
            boxShadow: "var(--calmy-shadow-xs)",
          }}
        >
          성장 기록
        </button>
      </div>

      {/* 3줄 요약 통계 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "16px 20px 0" }}>
        {[
          { label: "총 연습", value: `${totalCount}회` },
          { label: "연속 일수", value: `${streakDays}일` },
          { label: "평균 점수", value: totalCount > 0 ? `${avgScore}점` : "—" },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "white",
              borderRadius: 16,
              padding: "14px 10px",
              textAlign: "center",
              border: "1px solid var(--calmy-border-subtle)",
              boxShadow: "var(--calmy-shadow-xs)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--calmy-primary-600)" }}>{value}</div>
            <div style={{ fontSize: 11, color: "var(--calmy-neutral-500)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 점수 추이 그래프 */}
      <div style={{ padding: "16px 20px 0" }}>
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "18px 16px",
            border: "1px solid var(--calmy-border-subtle)",
            boxShadow: "var(--calmy-shadow-xs)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <TrendingUp size={16} color="var(--calmy-primary-600)" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>이번 주 점수 추이</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
            {weekScores.map((score, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div
                  style={{
                    width: "100%",
                    height: score > 0 ? `${(score / 100) * 70}px` : 3,
                    background:
                      score === 0
                        ? "var(--calmy-neutral-100)"
                        : i === todayIdx
                        ? "var(--calmy-primary-600)"
                        : "var(--calmy-primary-200)",
                    borderRadius: 6,
                    transition: "height 400ms ease",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: i === todayIdx ? 700 : 400,
                    color: i === todayIdx ? "var(--calmy-primary-600)" : "var(--calmy-neutral-400)",
                  }}
                >
                  {dayNames[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI 인사이트 카드 */}
      <div style={{ padding: "12px 20px 0" }}>
        <div
          style={{
            background: "linear-gradient(135deg, var(--calmy-primary-50), white)",
            borderRadius: 18,
            padding: "16px",
            border: "1px solid var(--calmy-primary-200)",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <MascotMint size={44} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--calmy-primary-600)", marginBottom: 4 }}>
              AI 패턴 인사이트
            </div>
            <div style={{ fontSize: 13, color: "var(--calmy-neutral-700)", lineHeight: 1.6 }}>
              {totalCount === 0
                ? "아직 연습 기록이 없어요. 첫 번째 연습을 시작해 보세요!"
                : `${totalCount}회 연습 중 주소 전달이 가장 어려운 구간이에요. 또박또박 말하는 연습을 해보세요.`}
            </div>
          </div>
        </div>
      </div>

      {/* 회차별 기록 — 날짜 그룹 */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--calmy-neutral-700)" }}>
          회차별 기록
        </div>

        {history.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "28px",
              textAlign: "center",
              border: "1px solid var(--calmy-border-subtle)",
            }}
          >
            <div style={{ marginBottom: 10 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="3" width="16" height="18" rx="2.5" fill="#EEF1FC" />
                <rect x="4" y="3" width="16" height="18" rx="2.5" stroke="#3C70FF" strokeWidth="1.5" />
                <line x1="8" y1="8" x2="16" y2="8" stroke="#3C70FF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="#8DFFC3" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="8" y1="16" x2="13" y2="16" stroke="#3C70FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>
            <div style={{ fontSize: 14, color: "var(--calmy-neutral-500)" }}>아직 완료한 연습이 없어요</div>
            <Link href="/practice">
              <button
                style={{
                  marginTop: 16,
                  padding: "10px 24px",
                  background: "var(--calmy-primary-600)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                연습 시작하기
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {grouped.map(({ dateKey, label, records }) => {
              const isCollapsed = !!collapsed[dateKey];
              return (
                <div
                  key={dateKey}
                  style={{
                    background: "white",
                    borderRadius: 16,
                    border: "1px solid var(--calmy-border-subtle)",
                    overflow: "hidden",
                    boxShadow: "var(--calmy-shadow-xs)",
                  }}
                >
                  {/* 날짜 헤더 */}
                  <button
                    onClick={() => toggleGroup(dateKey)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--calmy-text-primary)" }}>
                        {label}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 9999,
                          background: "var(--calmy-primary-50)",
                          color: "var(--calmy-primary-600)",
                        }}
                      >
                        {records.length}회
                      </span>
                    </div>
                    {isCollapsed
                      ? <ChevronDown size={16} color="var(--calmy-neutral-400)" />
                      : <ChevronUp size={16} color="var(--calmy-neutral-400)" />
                    }
                  </button>

                  {/* 기록 목록 */}
                  {!isCollapsed && (
                    <div style={{ borderTop: "1px solid var(--calmy-border-subtle)" }}>
                      {records.map((record, idx) => (
                        <Link
                          key={record.id}
                          href={`/practice/report/${record.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div
                            style={{
                              padding: "12px 16px",
                              display: "flex",
                              alignItems: "center",
                              gap: 14,
                              borderBottom:
                                idx < records.length - 1
                                  ? "1px solid var(--calmy-border-subtle)"
                                  : "none",
                            }}
                          >
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 14,
                                background:
                                  record.score >= 85
                                    ? "#C8FCE0"
                                    : record.score >= 70
                                    ? "#FEF3C7"
                                    : "#FEE2E2",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                fontWeight: 700,
                                color:
                                  record.score >= 85
                                    ? "#047a44"
                                    : record.score >= 70
                                    ? "#92400E"
                                    : "#DC2626",
                                flexShrink: 0,
                              }}
                            >
                              {record.score}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "var(--calmy-text-primary)",
                                  marginBottom: 2,
                                }}
                              >
                                {record.scenarioTitle} · Level {record.level}
                              </div>
                              <div style={{ fontSize: 12, color: "var(--calmy-neutral-400)" }}>
                                {new Date(record.date).toLocaleTimeString("ko-KR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                · 힌트 {record.hintsUsed}회
                              </div>
                            </div>
                            <ChevronRight size={16} color="var(--calmy-neutral-400)" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ height: 24 }} />

      {/* 맨 위로 버튼 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "calc(88px + env(safe-area-inset-bottom))",
            right: "calc(max(0px, (100vw - 390px) / 2) + 20px)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "var(--calmy-primary-600)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(60,112,255,0.35)",
            zIndex: 100,
          }}
        >
          <ArrowUp size={20} color="white" />
        </button>
      )}
    </div>
  );
}
