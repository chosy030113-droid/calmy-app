"use client";
import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import { Bell, MessageSquare, BarChart2, ChevronRight, Phone, Mic, X } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";

const AMPM_ITEMS = ["오전", "오후"];
const HOUR_ITEMS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const MIN_ITEMS = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
const ITEM_H = 44;

function DrumRoll({
  items,
  initialIndex,
  onSelect,
}: {
  items: string[];
  initialIndex: number;
  onSelect: (idx: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [localIdx, setLocalIdx] = useState(initialIndex);
  const localIdxRef = useRef(initialIndex);
  const onSelectRef = useRef(onSelect);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = initialIndex * ITEM_H;
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(items.length - 1, localIdxRef.current + dir));
      localIdxRef.current = next;
      setLocalIdx(next);
      onSelectRef.current(next);
      el.scrollTo({ top: next * ITEM_H, behavior: "smooth" });
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [items.length]);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const idx = Math.round(ref.current.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    localIdxRef.current = clamped;
    setLocalIdx(clamped);
    onSelectRef.current(clamped);
  }, [items.length]);

  return (
    <div style={{ position: "relative", height: ITEM_H * 5, overflow: "hidden", flex: 1 }}>
      {/* 선택 하이라이트 */}
      <div
        style={{
          position: "absolute",
          top: ITEM_H * 2,
          left: 4,
          right: 4,
          height: ITEM_H,
          background: "var(--calmy-primary-50)",
          borderRadius: 10,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* 위 페이드 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: ITEM_H * 2,
          background: "linear-gradient(to bottom, white 30%, rgba(255,255,255,0))",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      {/* 아래 페이드 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: ITEM_H * 2,
          background: "linear-gradient(to top, white 30%, rgba(255,255,255,0))",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      {/* 스크롤 컨테이너 */}
      <div
        ref={ref}
        className="drum-scroll"
        onScroll={handleScroll}
        style={{
          position: "absolute",
          inset: 0,
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          zIndex: 1,
        }}
      >
        <div style={{ height: ITEM_H * 2 }} />
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              height: ITEM_H,
              scrollSnapAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: idx === localIdx ? 20 : 17,
              fontWeight: idx === localIdx ? 700 : 400,
              color:
                idx === localIdx
                  ? "var(--calmy-text-primary)"
                  : "var(--calmy-neutral-300)",
              userSelect: "none",
            }}
          >
            {item}
          </div>
        ))}
        <div style={{ height: ITEM_H * 2 }} />
      </div>
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 48, height: 28, borderRadius: 9999,
        background: on ? "var(--calmy-primary-600)" : "var(--calmy-neutral-200)",
        position: "relative", cursor: "pointer", flexShrink: 0,
        transition: "background 200ms",
      }}
    >
      <div style={{
        position: "absolute", top: 4, left: on ? 24 : 4,
        width: 20, height: 20, borderRadius: "50%", background: "white",
        transition: "left 200ms",
        boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
      }} />
    </div>
  );
}

export default function AssistPage() {
  const {
    history,
    alarmOn, alarmAmpm, alarmHour, alarmMinute,
    setAlarmOn, setAlarmTime,
  } = useStore();

  const ampm = alarmAmpm;
  const hour = alarmHour;
  const minute = alarmMinute;

  const [showPicker, setShowPicker] = useState(false);
  const [closingPicker, setClosingPicker] = useState(false);
  const [tempAmpmIdx, setTempAmpmIdx] = useState(1);
  const [tempHourIdx, setTempHourIdx] = useState(7);
  const [tempMinIdx, setTempMinIdx] = useState(0);

  const alarmTimeDisplay = `${ampm} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const alarmTimeText = `${ampm} ${hour}시 ${String(minute).padStart(2, "0")}분`;

  const openPicker = () => {
    setTempAmpmIdx(AMPM_ITEMS.indexOf(ampm));
    setTempHourIdx(hour - 1);
    setTempMinIdx(minute / 5);
    setShowPicker(true);
  };

  const closePicker = () => {
    setClosingPicker(true);
    setTimeout(() => { setShowPicker(false); setClosingPicker(false); }, 300);
  };

  const confirmPicker = () => {
    setAlarmTime(
      AMPM_ITEMS[tempAmpmIdx] as "오전" | "오후",
      tempHourIdx + 1,
      tempMinIdx * 5,
    );
    closePicker();
  };

  const [subtitleOn, setSubtitleOn] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const recentFeedback = history.slice(0, 3);

  return (
    <div style={{ background: "var(--calmy-bg-app)", minHeight: "100%", paddingBottom: 32 }}>
      {/* 헤더 */}
      <header style={{ padding: "20px 20px 0" }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>통화 보조</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--calmy-neutral-500)" }}>
          실제 통화 전·중·후에 도움을 드려요
        </p>
      </header>

      <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ① 통화 전 알림 예약 */}
        <div style={{
          background: "white", borderRadius: 20,
          border: "1px solid var(--calmy-border-subtle)",
          boxShadow: "var(--calmy-shadow-xs)", overflow: "hidden",
        }}>
          <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: alarmOn ? "#FFFCE0" : "var(--calmy-neutral-100)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              transition: "background 200ms",
            }}>
              <Bell size={20} color={alarmOn ? "#7a6800" : "var(--calmy-neutral-400)"} strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>통화 전 알림 예약</div>
              <div style={{ fontSize: 12, color: "var(--calmy-neutral-500)", marginTop: 2 }}>
                {alarmOn ? `다음 알림 · ${alarmTimeDisplay}` : "알림이 꺼져 있어요"}
              </div>
            </div>
            <Toggle on={alarmOn} onToggle={() => setAlarmOn(!alarmOn)} />
          </div>

          {alarmOn && (
            <div style={{ padding: "0 18px 18px" }}>
              {/* 알림 시간 표시 행 */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--calmy-neutral-700)" }}>알림 시간</span>
                <button
                  onClick={openPicker}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    border: "1.5px solid var(--calmy-primary-300)",
                    background: "white",
                    color: "var(--calmy-primary-600)",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: 0.5,
                  }}
                >
                  {alarmTimeDisplay}
                </button>
              </div>

              {/* 알림 확인 문구 */}
              <div style={{
                padding: "12px 14px",
                background: "rgba(60,112,255,0.06)", borderRadius: 12,
                fontSize: 13, color: "var(--calmy-primary-600)", fontWeight: 500,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <Bell size={14} />
                {alarmTimeText}에 "오늘 통화 연습 할 시간이에요!" 알림을 드릴게요.
              </div>
            </div>
          )}
        </div>

        {/* ② 실시간 자막 */}
        <div style={{
          background: "white", borderRadius: 20,
          border: "1px solid var(--calmy-border-subtle)",
          boxShadow: "var(--calmy-shadow-xs)", overflow: "hidden",
        }}>
          <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: subtitleOn ? "rgba(141,255,195,0.25)" : "var(--calmy-neutral-100)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              transition: "background 200ms",
            }}>
              <MessageSquare size={20} color={subtitleOn ? "#047a44" : "var(--calmy-neutral-400)"} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>실시간 자막</div>
              <div style={{ fontSize: 12, color: "var(--calmy-neutral-500)", marginTop: 2 }}>
                통화 중 상대방 말을 텍스트로 변환해요
              </div>
            </div>
            <Toggle on={subtitleOn} onToggle={() => { setSubtitleOn((v) => !v); setCallActive(false); }} />
          </div>

          {subtitleOn && (
            <div style={{ padding: "0 18px 18px" }}>
              <div style={{
                background: "#1a1a2e", borderRadius: 16, padding: "16px",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: callActive ? "#03C75A" : "#94A3B8",
                      boxShadow: callActive ? "0 0 6px #03C75A" : "none",
                    }} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                      {callActive ? "통화 중 · 00:23" : "대기 중"}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                    background: "rgba(141,255,195,0.18)", color: "#8DFFC3",
                  }}>
                    자막 ON
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 64 }}>
                  {callActive ? (
                    <>
                      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "rgba(255,255,255,0.9)" }}>
                        안녕하세요, ○○카페입니다.
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "rgba(255,255,255,0.9)" }}>
                        주문 도와드릴까요?
                        <span style={{ display: "inline-block", width: 2, height: 14, background: "#8DFFC3", marginLeft: 2, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", paddingTop: 12 }}>
                      통화를 시작하면 자막이 여기에 표시돼요
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: 16, paddingTop: 4 }}>
                  <button
                    onClick={() => setCallActive((v) => !v)}
                    style={{
                      width: 52, height: 52, borderRadius: "50%", border: "none", cursor: "pointer",
                      background: callActive ? "#EF4444" : "#03C75A",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: callActive ? "0 0 16px rgba(239,68,68,0.4)" : "0 0 16px rgba(3,199,90,0.4)",
                      transition: "background 200ms, box-shadow 200ms",
                    }}
                  >
                    <Phone size={22} color="white" />
                  </button>
                  <button style={{
                    width: 52, height: 52, borderRadius: "50%", border: "none", cursor: "pointer",
                    background: "rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Mic size={22} color="rgba(255,255,255,0.6)" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ③ 통화 후 피드백 */}
        <div style={{
          background: "white", borderRadius: 20,
          border: "1px solid var(--calmy-border-subtle)",
          boxShadow: "var(--calmy-shadow-xs)", overflow: "hidden",
        }}>
          <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: "var(--calmy-primary-50)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <BarChart2 size={20} color="var(--calmy-primary-600)" strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>통화 후 피드백</div>
              <div style={{ fontSize: 12, color: "var(--calmy-neutral-500)", marginTop: 2 }}>
                연습 완료 후 AI 피드백을 받아요
              </div>
            </div>
          </div>

          <div style={{ padding: "0 18px 18px" }}>
            {recentFeedback.length === 0 ? (
              <div style={{ padding: "20px 0", textAlign: "center", color: "var(--calmy-neutral-400)", fontSize: 13 }}>
                <div style={{ marginBottom: 8 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="3" width="16" height="18" rx="2.5" fill="#EEF1FC"/>
                    <rect x="4" y="3" width="16" height="18" rx="2.5" stroke="#3C70FF" strokeWidth="1.5"/>
                    <line x1="8" y1="8" x2="16" y2="8" stroke="#3C70FF" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="8" y1="12" x2="16" y2="12" stroke="#8DFFC3" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="8" y1="16" x2="13" y2="16" stroke="#3C70FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                  </svg>
                </div>
                연습을 완료하면 피드백이 쌓여요
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {recentFeedback.map((record) => {
                  const scoreColor = record.score >= 85 ? "#03C75A" : record.score >= 70 ? "#F59E0B" : "#EF4444";
                  return (
                    <Link key={record.id} href={`/practice/report/${record.id}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        background: "var(--calmy-neutral-50)", borderRadius: 14,
                        padding: "12px 14px",
                        border: "1px solid var(--calmy-border-subtle)",
                        display: "flex", alignItems: "center", gap: 12,
                      }}>
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <svg width={44} height={44} viewBox="0 0 44 44">
                            <circle cx="22" cy="22" r="17" fill="none" stroke="var(--calmy-neutral-100)" strokeWidth="4"/>
                            <circle
                              cx="22" cy="22" r="17"
                              fill="none" stroke={scoreColor} strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray={`${(record.score / 100) * 106.8} 106.8`}
                              transform="rotate(-90 22 22)"
                            />
                          </svg>
                          <div style={{
                            position: "absolute", inset: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 800, color: scoreColor,
                          }}>
                            {record.score}
                          </div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--calmy-text-primary)" }}>
                            {record.scenarioTitle}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--calmy-neutral-400)", marginTop: 2 }}>
                            Level {record.level} · {new Date(record.date).toLocaleDateString("ko-KR")}
                          </div>
                        </div>
                        <ChevronRight size={16} color="var(--calmy-neutral-400)" />
                      </div>
                    </Link>
                  );
                })}

                <Link href="/practice/growth" style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                    padding: "10px", fontSize: 13, fontWeight: 600,
                    color: "var(--calmy-primary-600)", cursor: "pointer",
                  }}>
                    전체 기록 보기 <ChevronRight size={14} />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(0); }
          to   { transform: translateY(100%); }
        }
        .drum-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* 시간 설정 바텀 시트 */}
      {showPicker && (
        <div
          onClick={closePicker}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 200,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 390,
              background: "white",
              borderRadius: "24px 24px 0 0",
              paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
              animation: `${closingPicker ? "slideDown" : "slideUp"} 300ms cubic-bezier(0.32, 0.72, 0, 1)`,
            }}
          >
            {/* 시트 헤더 */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 20px 4px",
            }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>알림 시간 설정</h3>
              <button
                onClick={closePicker}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "var(--calmy-neutral-400)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* 드럼롤 피커 — 오전/오후 · 시 · 분 */}
            <div style={{ display: "flex", alignItems: "center", padding: "4px 20px 4px", gap: 4 }}>
              <DrumRoll
                items={AMPM_ITEMS}
                initialIndex={tempAmpmIdx}
                onSelect={setTempAmpmIdx}
              />
              <span style={{
                fontSize: 20, fontWeight: 300, color: "var(--calmy-neutral-300)",
                flexShrink: 0, paddingBottom: 2, width: 14, textAlign: "center",
              }}>
                :
              </span>
              <DrumRoll
                items={HOUR_ITEMS}
                initialIndex={tempHourIdx}
                onSelect={setTempHourIdx}
              />
              <span style={{
                fontSize: 20, fontWeight: 300, color: "var(--calmy-neutral-300)",
                flexShrink: 0, paddingBottom: 2, width: 14, textAlign: "center",
              }}>
                :
              </span>
              <DrumRoll
                items={MIN_ITEMS}
                initialIndex={tempMinIdx}
                onSelect={setTempMinIdx}
              />
            </div>

            {/* 확인 버튼 */}
            <div style={{ padding: "16px 20px 0" }}>
              <button
                onClick={confirmPicker}
                style={{
                  width: "100%", padding: "15px",
                  background: "var(--calmy-primary-600)", color: "white",
                  border: "none", borderRadius: 14,
                  fontSize: 16, fontWeight: 700, cursor: "pointer",
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
