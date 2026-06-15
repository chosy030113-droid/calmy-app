"use client";
import { ArrowLeft, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function NotificationsPage() {
  const router = useRouter();
  const { alarmOn, alarmAmpm, alarmHour, alarmMinute, setAlarmOn } = useStore();

  const dailyAlarmTime = `${alarmAmpm} ${String(alarmHour).padStart(2, "0")}:${String(alarmMinute).padStart(2, "0")}`;

  const items = [
    { label: "매일 연습 알림", time: dailyAlarmTime, on: alarmOn, onToggle: () => setAlarmOn(!alarmOn) },
    { label: "연속 기록 알림", time: "목표 달성 시", on: true, onToggle: () => {} },
    { label: "주간 리포트", time: "매주 일요일 오전 9시", on: false, onToggle: () => {} },
  ];

  return (
    <div style={{ background: "var(--calmy-bg-app)", minHeight: "100%" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 16px 0" }}>
        <button
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <ArrowLeft size={22} color="var(--calmy-text-primary)" />
        </button>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>알림 설정</h1>
      </header>

      <div style={{ padding: "20px 20px 0" }}>
        {items.map(({ label, time, on, onToggle }) => (
          <div
            key={label}
            style={{
              background: "white",
              borderRadius: 16,
              padding: "16px",
              border: "1px solid var(--calmy-border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "var(--calmy-primary-50)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={18} color="var(--calmy-primary-600)" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--calmy-neutral-500)" }}>{time}</div>
              </div>
            </div>
            <div
              style={{
                width: 48,
                height: 28,
                borderRadius: 9999,
                background: on ? "var(--calmy-primary-600)" : "var(--calmy-neutral-200)",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  left: on ? 24 : 4,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 200ms",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
