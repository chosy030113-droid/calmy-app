"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, Flame, ChevronRight, Trophy, Calendar, BarChart2, X, Megaphone, Lightbulb, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import { scenarios } from "@/data/scenarios";
import ScenarioIcon from "@/components/ScenarioIcon";
import MascotYellow from "@/components/MascotYellow";

const NOTICES = [
  {
    id: 1,
    icon: <Megaphone size={18} color="#3C70FF" />,
    iconBg: "var(--calmy-primary-50)",
    title: "새 시나리오가 추가됐어요",
    desc: "관공서 문의·면접 결과 시나리오에 고급 레벨이 업데이트됐어요. 도전해보세요!",
    time: "2일 전",
    unread: true,
  },
  {
    id: 2,
    icon: <Star size={18} color="#7a6800" />,
    iconBg: "#FFFCE0",
    title: "3일 연속 연습 달성!",
    desc: "꾸준히 연습하고 계시네요. 이 속도라면 통화 자신감이 금방 올라갈 거예요.",
    time: "오늘",
    unread: true,
  },
  {
    id: 3,
    icon: <Lightbulb size={18} color="#047a44" />,
    iconBg: "var(--calmy-accent-mint-bg)",
    title: "통화 긴장 완화 꿀팁",
    desc: "전화 전 코로 숨을 3번 깊게 들이쉬면 긴장이 줄어들어요. 오늘 연습 전에 해보세요!",
    time: "3일 전",
    unread: false,
  },
];

export default function HomePage() {
  const { nickname, history, streakDays, alarmOn, alarmAmpm, alarmHour, alarmMinute } = useStore();
  const [showNotif, setShowNotif] = useState(false);
  const [closingNotif, setClosingNotif] = useState(false);
  const closeNotif = () => {
    setClosingNotif(true);
    setTimeout(() => { setShowNotif(false); setClosingNotif(false); }, 300);
  };
  const displayName = nickname || "사용자";

  const today = new Date();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const todayStr = `${today.getMonth() + 1}월 ${today.getDate()}일 (${dayNames[today.getDay()]})`;

  const totalCount = history.length;
  const recentScore = history[0]?.score ?? null;

  // 추천 시나리오 — 히스토리 없으면 첫 번째, 있으면 다음 미완료
  const recommended = scenarios[0];

  const nextAlarm = alarmOn
    ? `${alarmAmpm} ${String(alarmHour).padStart(2, "0")}:${String(alarmMinute).padStart(2, "0")}`
    : null;

  return (
    <div style={{ background: "var(--calmy-bg-app)", minHeight: "100%" }}>
      {/* 헤더 */}
      <header style={{ padding: "16px 20px 0" }}>
        {/* 로고 행 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Image
            src="/calmy-symbol.png"
            alt="CALMY"
            width={72}
            height={59}
            style={{ objectFit: "contain" }}
            priority
          />
          <button
            onClick={() => setShowNotif(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: "50%",
              color: "var(--calmy-neutral-500)",
              position: "relative",
            }}
          >
            <Bell size={22} />
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                background: "#EF4444",
                borderRadius: "50%",
                border: "2px solid var(--calmy-bg-app)",
              }}
            />
          </button>
        </div>
        {/* 인사말 행 */}
        <div style={{ marginTop: 10 }}>
          <p style={{ margin: 0, fontSize: 12, color: "var(--calmy-neutral-500)" }}>{todayStr}</p>
          <h1 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 700, color: "var(--calmy-text-primary)" }}>
            안녕하세요, {displayName}님
          </h1>
        </div>
      </header>

      {/* 오늘의 추천 카드 */}
      <section style={{ padding: "20px 20px 0" }}>
        <div
          style={{
            background: "#EEF4FF",
            borderRadius: 20,
            border: "2.5px solid #3C70FF",
            padding: "24px 20px 20px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* 배경 장식 */}
          <div
            style={{
              position: "absolute",
              top: -20,
              right: 80,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <div style={{ flex: 1 }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(60,112,255,0.12)",
                color: "#3C70FF",
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 9999,
                marginBottom: 10,
              }}
            >
              오늘의 추천 연습
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#3C70FF",
                lineHeight: 1.3,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ScenarioIcon id={recommended.id} size={22} />
              {recommended.title}
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#5B8AFF" }}>
              Level 1 · 약 3분
            </p>
            <Link href={`/practice/${recommended.id}`}>
              <button
                style={{
                  marginTop: 16,
                  background: "#3C70FF",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  boxShadow: "0 4px 12px rgba(60,112,255,0.3)",
                }}
              >
                시작하기 <ChevronRight size={16} />
              </button>
            </Link>
          </div>
          <div style={{ marginBottom: -8, marginRight: -8 }}>
            <MascotYellow size={148} />
          </div>
        </div>
      </section>

      {/* 통계 카드 3개 */}
      <section style={{ padding: "16px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { icon: <Flame size={18} color="#EF4444" />, label: "연속 일수", value: `${streakDays}일` },
          { icon: <Trophy size={18} color="#F59E0B" />, label: "총 연습", value: `${totalCount}회` },
          { icon: <BarChart2 size={18} color="#3C70FF" />, label: "최근 점수", value: recentScore !== null ? `${recentScore}점` : "—" },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            style={{
              background: "var(--calmy-white)",
              borderRadius: 16,
              padding: "14px 12px",
              border: "1px solid var(--calmy-border-subtle)",
              boxShadow: "var(--calmy-shadow-xs)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--calmy-text-primary)" }}>{value}</div>
            <div style={{ fontSize: 11, color: "var(--calmy-neutral-500)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </section>

      {/* 알림 예약 현황 카드 */}
      <section style={{ padding: "16px 20px 0" }}>
        <Link href="/mypage/notifications" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "var(--calmy-white)",
              borderRadius: 16,
              padding: "16px",
              border: "1px solid var(--calmy-border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "var(--calmy-shadow-xs)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#FFFCE0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={18} color="#7a6800" strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--calmy-text-primary)" }}>다음 알림</div>
                <div style={{ fontSize: 12, color: "var(--calmy-neutral-500)" }}>
                  {nextAlarm ? `오늘 ${nextAlarm}` : "알림 꺼짐"}
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--calmy-neutral-400)" />
          </div>
        </Link>
      </section>

      {/* 성장 기록 요약 카드 */}
      <section style={{ padding: "16px 20px 0" }}>
        <Link href="/practice/growth" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "var(--calmy-white)",
              borderRadius: 16,
              padding: "16px",
              border: "1px solid var(--calmy-border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "var(--calmy-shadow-xs)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "var(--calmy-accent-mint-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Calendar size={18} color="#047a44" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--calmy-text-primary)" }}>성장 기록</div>
                <div style={{ fontSize: 12, color: "var(--calmy-neutral-500)" }}>
                  {totalCount > 0 ? `총 ${totalCount}회 완료` : "아직 기록이 없어요"}
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--calmy-neutral-400)" />
          </div>
        </Link>
      </section>

      {/* 지금 바로 연습하기 CTA */}
      <section style={{ padding: "20px 20px 0" }}>
        <Link href="/practice">
          <button
            style={{
              width: "100%",
              background: "var(--calmy-primary-600)",
              color: "white",
              border: "none",
              borderRadius: 16,
              padding: "16px",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "var(--calmy-shadow-lg)",
            }}
          >
            지금 바로 연습하기
          </button>
        </Link>
      </section>

      <div style={{ height: 24 }} />

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(0); }
          to   { transform: translateY(100%); }
        }
      `}</style>

      {/* 새 소식 바텀 시트 */}
      {showNotif && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 200,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={closeNotif}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 390,
              background: "white",
              borderRadius: "24px 24px 0 0",
              padding: "0 0 48px",
              animation: `${closingNotif ? "slideDown" : "slideUp"} 300ms cubic-bezier(0.32, 0.72, 0, 1)`,
            }}
          >
            {/* 타이틀 행 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 20px 16px" }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--calmy-text-primary)" }}>새 소식</h2>
              <button
                onClick={closeNotif}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "var(--calmy-neutral-400)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* 소식 목록 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
              {NOTICES.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "14px 10px",
                    borderRadius: 16,
                    background: item.unread ? "var(--calmy-neutral-50)" : "white",
                    position: "relative",
                  }}
                >
                  {/* 아이콘 */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: item.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* 텍스트 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--calmy-text-primary)", marginBottom: 3 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--calmy-neutral-500)", lineHeight: 1.5 }}>
                      {item.desc}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--calmy-neutral-400)", marginTop: 6 }}>
                      {item.time}
                    </div>
                  </div>

                  {/* 읽지 않음 점 */}
                  {item.unread && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#3C70FF",
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
