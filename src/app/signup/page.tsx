"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check } from "lucide-react";
import { useStore } from "@/lib/store";

const ANXIETY_OPTIONS = [
  { id: "unexpected", label: "갑자기 울리는 전화가 무서워요", emoji: "📳" },
  { id: "outgoing", label: "모르는 번호에 먼저 전화하기 힘들어요", emoji: "📞" },
  { id: "speechless", label: "통화 중에 무슨 말을 해야 할지 모르겠어요", emoji: "💬" },
  { id: "postregret", label: "통화가 끝난 뒤에도 계속 걱정돼요", emoji: "😟" },
];

export default function SignupPage() {
  const router = useRouter();
  const { setNickname, setAnxietyType } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 — 기본 정보
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Step 2 — 닉네임
  const [nicknameInput, setNicknameInput] = useState("");

  // Step 3 — 불안 유형
  const [selectedAnxiety, setSelectedAnxiety] = useState("");

  const handleStep1 = () => {
    if (!name || !email || !password || password !== passwordConfirm) return;
    setStep(2);
  };

  const handleStep2 = () => {
    if (!nicknameInput.trim()) return;
    setStep(3);
  };

  const handleStep3 = () => {
    if (!selectedAnxiety) return;
    setNickname(nicknameInput.trim());
    const label = ANXIETY_OPTIONS.find((o) => o.id === selectedAnxiety)?.label ?? "";
    setAnxietyType(label);
    router.push("/");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    border: "1.5px solid #E2E8F0",
    borderRadius: 14,
    fontSize: 15,
    outline: "none",
    background: "#F8FAFC",
    boxSizing: "border-box",
    color: "#1E293B",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        background: "white",
        maxWidth: 390,
        margin: "0 auto",
        padding: "0 28px",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingTop: 56,
          marginBottom: 32,
          gap: 12,
        }}
      >
        {step === 1 ? (
          <Link href="/login">
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <ArrowLeft size={22} color="#334155" />
            </button>
          </Link>
        ) : (
          <button
            onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            <ArrowLeft size={22} color="#334155" />
          </button>
        )}

        {/* 스텝 인디케이터 */}
        <div style={{ flex: 1, display: "flex", gap: 6 }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 9999,
                background: s <= step ? "#3C70FF" : "#E2E8F0",
                transition: "background 300ms",
              }}
            />
          ))}
        </div>
      </div>

      {/* ─── STEP 1: 기본 정보 ─── */}
      {step === 1 && (
        <>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700, color: "#1E293B" }}>
              회원가입
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: "#94A3B8" }}>
              CALMY와 함께 통화 연습을 시작해요
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>
                이름
              </label>
              <input
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>
                이메일
              </label>
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>
                비밀번호
              </label>
              <input
                type="password"
                placeholder="8자 이상 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>
                비밀번호 확인
              </label>
              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor:
                    passwordConfirm && password !== passwordConfirm
                      ? "#EF4444"
                      : "#E2E8F0",
                }}
              />
              {passwordConfirm && password !== passwordConfirm && (
                <p style={{ margin: "5px 0 0", fontSize: 12, color: "#EF4444" }}>
                  비밀번호가 일치하지 않아요
                </p>
              )}
            </div>

            <button
              onClick={handleStep1}
              disabled={!name || !email || !password || password !== passwordConfirm}
              style={{
                marginTop: 6,
                width: "100%",
                padding: "16px",
                background:
                  name && email && password && password === passwordConfirm
                    ? "#3C70FF"
                    : "#E2E8F0",
                color:
                  name && email && password && password === passwordConfirm
                    ? "white"
                    : "#94A3B8",
                border: "none",
                borderRadius: 16,
                fontSize: 16,
                fontWeight: 700,
                cursor: name && email && password && password === passwordConfirm
                  ? "pointer"
                  : "default",
                transition: "background 200ms, color 200ms",
              }}
            >
              다음
            </button>
          </div>

          <div style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "#64748B" }}>
            이미 계정이 있으신가요?{" "}
            <Link href="/login" style={{ color: "#3C70FF", fontWeight: 700, textDecoration: "none" }}>
              로그인
            </Link>
          </div>
        </>
      )}

      {/* ─── STEP 2: 닉네임 설정 ─── */}
      {step === 2 && (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <Image
              src="/calmy-symbol.png"
              alt="CALMY"
              width={90}
              height={74}
              style={{ objectFit: "contain" }}
            />
          </div>

          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: "#1E293B" }}>
              닉네임을 알려주세요
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: "#94A3B8" }}>
              앱에서 부를 이름을 정해요
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="text"
              placeholder="예: 서영이, 콜포비아 극복러"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              maxLength={12}
              style={inputStyle}
              autoFocus
            />
            <div style={{ textAlign: "right", fontSize: 12, color: "#94A3B8" }}>
              {nicknameInput.length}/12
            </div>

            <button
              onClick={handleStep2}
              disabled={!nicknameInput.trim()}
              style={{
                width: "100%",
                padding: "16px",
                background: nicknameInput.trim() ? "#3C70FF" : "#E2E8F0",
                color: nicknameInput.trim() ? "white" : "#94A3B8",
                border: "none",
                borderRadius: 16,
                fontSize: 16,
                fontWeight: 700,
                cursor: nicknameInput.trim() ? "pointer" : "default",
                transition: "background 200ms, color 200ms",
              }}
            >
              다음
            </button>
          </div>
        </>
      )}

      {/* ─── STEP 3: 불안 유형 선택 ─── */}
      {step === 3 && (
        <>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: "#1E293B" }}>
              어떤 상황이 가장 어려운가요?
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: "#94A3B8" }}>
              {nicknameInput}님에게 맞는 연습을 추천해 드릴게요
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {ANXIETY_OPTIONS.map((opt) => {
              const selected = selectedAnxiety === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedAnxiety(opt.id)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    border: `2px solid ${selected ? "#3C70FF" : "#E2E8F0"}`,
                    borderRadius: 16,
                    background: selected ? "#EEF1FC" : "white",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 150ms, background 150ms",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{opt.emoji}</span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontWeight: selected ? 600 : 400,
                      color: selected ? "#3C70FF" : "#334155",
                      lineHeight: 1.4,
                    }}
                  >
                    {opt.label}
                  </span>
                  {selected && (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "#3C70FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Check size={13} color="white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleStep3}
            disabled={!selectedAnxiety}
            style={{
              width: "100%",
              padding: "16px",
              background: selectedAnxiety ? "#3C70FF" : "#E2E8F0",
              color: selectedAnxiety ? "white" : "#94A3B8",
              border: "none",
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 700,
              cursor: selectedAnxiety ? "pointer" : "default",
              boxShadow: selectedAnxiety ? "0 4px 16px rgba(60,112,255,0.35)" : "none",
              transition: "background 200ms, color 200ms",
            }}
          >
            CALMY 시작하기 🎉
          </button>
        </>
      )}
    </div>
  );
}
