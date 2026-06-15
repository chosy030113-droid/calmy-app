"use client";
import { use, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Lightbulb, Send } from "lucide-react";
import { useStore } from "@/lib/store";
import { scenarios } from "@/data/scenarios";
import { buildFeedback } from "@/lib/mockFeedback";
import MascotMint from "@/components/MascotMint";

type MsgRole = "ai" | "user" | "sample";

export default function SimPage({
  params,
  searchParams,
}: {
  params: Promise<{ scenarioId: string }>;
  searchParams: Promise<{ level?: string }>;
}) {
  const { scenarioId } = use(params);
  const { level: levelStr } = use(searchParams);
  const level = Number(levelStr ?? "1");

  const scenario = scenarios.find((s) => s.id === scenarioId);
  const levelData = scenario?.levels.find((l) => l.level === level);

  const router = useRouter();
  const { addRecord } = useStore();

  const [turnIdx, setTurnIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [messages, setMessages] = useState<{ role: MsgRole; text: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [showQuit, setShowQuit] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (levelData && messages.length === 0) {
      setMessages([{ role: "ai", text: levelData.turns[0].ai }]);
    }
  }, [levelData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  if (!scenario || !levelData) {
    return <div style={{ padding: 40, textAlign: "center" }}>시나리오 정보를 찾을 수 없어요.</div>;
  }

  const currentTurn = levelData.turns[turnIdx];

  const handleMicClick = () => {
    if (isRecording) return;
    setIsRecording(true);
    timerRef.current = setTimeout(() => {
      setIsRecording(false);
      const sample = currentTurn.sampleAnswer;
      setUserInput(sample);
      setMessages((m) => [...m, { role: "sample", text: sample }]);
    }, 2500);
  };

  const handleSend = () => {
    const text = userInput.trim();
    if (!text) return;

    const newMessages: { role: MsgRole; text: string }[] = [
      ...messages,
      { role: "user", text },
    ];

    const hit = currentTurn.expect.some((kw) =>
      text.toLowerCase().includes(kw.toLowerCase())
    );

    if (!hit && !showHint) {
      setShowHint(true);
      setHintsUsed((h) => h + 1);
      setMessages([...newMessages, { role: "ai", text: `💡 힌트: ${currentTurn.hint}` }]);
      setUserInput("");
      return;
    }

    const nextIdx = turnIdx + 1;
    if (nextIdx >= levelData.turns.length) {
      setMessages([...newMessages, { role: "ai", text: "수고하셨어요! 대화를 잘 마무리했어요 🎉" }]);
      setDone(true);
      setUserInput("");

      const feedback = buildFeedback(nextIdx, hintsUsed, levelData.turns.length);
      addRecord({
        id: `${scenarioId}-${level}-${Date.now()}`,
        scenarioId,
        scenarioTitle: scenario.title,
        level,
        score: feedback.score,
        praise: feedback.praise,
        improve: feedback.improve,
        hintsUsed,
        date: new Date().toISOString(),
      });

      setTimeout(() => {
        router.push(
          `/practice/${scenarioId}/complete?score=${feedback.score}&hints=${hintsUsed}&praise=${encodeURIComponent(feedback.praise.join("||"))}&improve=${encodeURIComponent(feedback.improve.join("||"))}&level=${level}`
        );
      }, 1200);
    } else {
      setShowHint(false);
      setTurnIdx(nextIdx);
      setMessages([...newMessages, { role: "ai", text: levelData.turns[nextIdx].ai }]);
      setUserInput("");
    }
  };

  const progress = (turnIdx / levelData.turns.length) * 100;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100dvh - env(safe-area-inset-top) - 72px - env(safe-area-inset-bottom))",
        background: "var(--calmy-bg-app)",
        maxWidth: 390,
        margin: "0 auto",
      }}
    >
      {/* ── 헤더 ── */}
      <header
        style={{
          padding: "12px 16px 10px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--calmy-white)",
          borderBottom: "1px solid var(--calmy-border-subtle)",
          flexShrink: 0,
        }}
      >
        {/* 시나리오 타이틀 + 프로그레스 바 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--calmy-text-primary)" }}>
            {scenario.icon} {scenario.title} · Level {level}
          </div>
          <div
            style={{
              marginTop: 6,
              height: 4,
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
                transition: "width 300ms ease",
              }}
            />
          </div>
        </div>

        {/* 진행 카운터 */}
        <span style={{ fontSize: 12, color: "var(--calmy-neutral-400)", flexShrink: 0 }}>
          {turnIdx}/{levelData.turns.length}
        </span>

        {/* 종료 버튼 */}
        <button
          onClick={() => setShowQuit(true)}
          style={{
            background: "none",
            border: "1.5px solid #FCA5A5",
            color: "#EF4444",
            borderRadius: 10,
            padding: "4px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          종료
        </button>
      </header>

      {/* ── AI 캐릭터 + 현재 대사 ── */}
      <div
        style={{
          background: "linear-gradient(180deg, #E2EAFF 0%, var(--calmy-bg-app) 100%)",
          padding: "14px 20px 12px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexShrink: 0,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <MascotMint size={68} />
        </div>
        <div
          style={{
            background: "white",
            borderRadius: "18px 18px 18px 4px",
            padding: "10px 14px",
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--calmy-text-primary)",
            border: "1px solid var(--calmy-primary-200)",
            boxShadow: "var(--calmy-shadow-xs)",
            flex: 1,
          }}
        >
          {currentTurn.ai}
        </div>
      </div>

      {/* ── 대화 내역 ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px" }}>
        {messages.map((msg, i) => {
          if (msg.role === "sample") {
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "var(--calmy-neutral-400)", marginBottom: 4, paddingRight: 4 }}>
                  💬 이렇게 말해보세요
                </div>
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "10px 14px",
                    borderRadius: "18px 18px 4px 18px",
                    background: "#EEF1FC",
                    color: "var(--calmy-primary-600)",
                    fontSize: 14,
                    lineHeight: 1.55,
                    border: "2px dashed #93AEFF",
                    fontStyle: "italic",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          }
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  maxWidth: "78%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background:
                    msg.role === "user"
                      ? "var(--calmy-primary-600)"
                      : msg.text.startsWith("💡")
                      ? "#FBF6B9"
                      : "white",
                  color:
                    msg.role === "user"
                      ? "white"
                      : msg.text.startsWith("💡")
                      ? "#7a6800"
                      : "var(--calmy-text-primary)",
                  fontSize: 14,
                  lineHeight: 1.55,
                  border: msg.role === "ai" ? "1px solid var(--calmy-border-subtle)" : "none",
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── 힌트 버튼 (16px 간격) ── */}
      {!done && (
        <div style={{ padding: "4px 16px 16px", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
          <button
            onClick={() => {
              setShowHint(true);
              setHintsUsed((h) => h + 1);
              setMessages((m) => [...m, { role: "ai", text: `💡 힌트: ${currentTurn.hint}` }]);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "#FFFCE0",
              border: "1px solid #E6D600",
              borderRadius: 9999,
              padding: "7px 16px",
              fontSize: 12,
              fontWeight: 600,
              color: "#7a6800",
              cursor: "pointer",
            }}
          >
            <Lightbulb size={13} />
            힌트 보기
          </button>
        </div>
      )}

      {/* ── 입력 영역 ── */}
      {!done && (
        <div
          style={{
            padding: "10px 14px 20px",
            background: "var(--calmy-white)",
            borderTop: "1px solid var(--calmy-border-subtle)",
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
            flexShrink: 0,
          }}
        >
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isRecording ? "🔴 녹음 중..." : "말씀해 주세요…"}
            rows={1}
            style={{
              flex: 1,
              resize: "none",
              border: `1.5px solid ${isRecording ? "#EF4444" : "var(--calmy-border)"}`,
              borderRadius: 14,
              padding: "11px 14px",
              fontSize: 14,
              fontFamily: "inherit",
              outline: "none",
              background: isRecording ? "#FEF2F2" : "var(--calmy-bg-app)",
              color: "var(--calmy-text-primary)",
              transition: "border-color 200ms, background 200ms",
            }}
          />

          {/* 전송 버튼 (텍스트 있을 때) */}
          {userInput.trim() ? (
            <button
              onClick={handleSend}
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: "var(--calmy-primary-600)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 0 0 4px rgba(60,112,255,0.15)",
              }}
            >
              <Send size={20} color="white" />
            </button>
          ) : (
            /* 마이크 버튼 (기본 활성 상태) */
            <button
              onClick={handleMicClick}
              disabled={isRecording}
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: isRecording ? "#EF4444" : "var(--calmy-primary-600)",
                border: "none",
                cursor: isRecording ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: isRecording
                  ? "0 0 0 6px rgba(239,68,68,0.2)"
                  : "0 0 0 4px rgba(60,112,255,0.15)",
                transition: "background 200ms, box-shadow 200ms",
              }}
            >
              {isRecording ? (
                <MicOff size={20} color="white" />
              ) : (
                <Mic size={20} color="white" />
              )}
            </button>
          )}
        </div>
      )}

      {/* 완료 상태 */}
      {done && (
        <div
          style={{
            padding: "16px",
            background: "var(--calmy-white)",
            borderTop: "1px solid var(--calmy-border-subtle)",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <p style={{ margin: 0, fontSize: 14, color: "var(--calmy-neutral-500)" }}>
            잠시 후 결과 화면으로 이동합니다…
          </p>
        </div>
      )}

      {/* ── 종료 확인 모달 ── */}
      {showQuit && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setShowQuit(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "24px 24px 0 0",
              padding: "28px 24px 40px",
              width: "100%",
              maxWidth: 390,
            }}
          >
            <div
              style={{ width: 36, height: 4, background: "var(--calmy-neutral-200)", borderRadius: 9999, margin: "0 auto 20px" }}
            />
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700 }}>연습을 중단할까요?</h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "var(--calmy-neutral-500)" }}>
              지금까지의 기록은 저장되지 않아요.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowQuit(false)}
                style={{
                  flex: 1, padding: "14px", border: "1px solid var(--calmy-border)", borderRadius: 14,
                  background: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
                }}
              >
                계속하기
              </button>
              <button
                onClick={() => router.push(`/practice/${scenarioId}`)}
                style={{
                  flex: 1, padding: "14px", border: "none", borderRadius: 14,
                  background: "#FEE2E2", color: "#DC2626", fontSize: 15, fontWeight: 700, cursor: "pointer",
                }}
              >
                중단하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
