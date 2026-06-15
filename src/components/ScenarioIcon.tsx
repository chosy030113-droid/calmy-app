function CafeIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 스팀 */}
      <path d="M8 5 Q7 3.5 8 2" stroke="#FFF46C" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 5 Q11 3.5 12 2" stroke="#FFF46C" strokeWidth="1.8" strokeLinecap="round"/>
      {/* 컵 몸통 */}
      <path d="M4 6 H20 L18 17 Q17.5 18 16.5 18 H7.5 Q6.5 18 6 17 Z" fill="#3C70FF"/>
      {/* 손잡이 */}
      <path d="M18 9 Q22.5 9 22.5 12 Q22.5 15 18 15" stroke="#3C70FF" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* 받침 */}
      <rect x="3" y="19" width="18" height="2.5" rx="1.25" fill="#8DFFC3"/>
    </svg>
  );
}

function DeliveryIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 배달 가방 몸통 */}
      <rect x="5" y="8" width="14" height="11" rx="2.5" fill="#3C70FF"/>
      {/* 손잡이 */}
      <path d="M9 8 V6 Q9 4 12 4 Q15 4 15 6 V8" stroke="#3C70FF" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* 버클 라인 */}
      <line x1="5" y1="13" x2="19" y2="13" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      {/* 앞 포켓 */}
      <rect x="9.5" y="14.5" width="5" height="3.5" rx="1" fill="#8DFFC3"/>
    </svg>
  );
}

function HospitalIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 건물 */}
      <rect x="4" y="8" width="16" height="14" rx="2" fill="#3C70FF"/>
      {/* 지붕 삼각형 */}
      <path d="M2 9 L12 3 L22 9 Z" fill="#8DFFC3"/>
      {/* 십자 — 중심(12,15), 팔 두께 2.5, 팔 길이 3.5 */}
      <rect x="10.75" y="11.5" width="2.5" height="7" rx="1" fill="white"/>
      <rect x="8.5" y="13.75" width="7" height="2.5" rx="1" fill="white"/>
    </svg>
  );
}

function InterviewIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 서류 파일 */}
      <rect x="5" y="3" width="14" height="18" rx="2.5" fill="#3C70FF"/>
      {/* 서류 접힘 모서리 */}
      <path d="M14 3 L19 8 H14 Z" fill="#8DFFC3"/>
      {/* 텍스트 라인 */}
      <line x1="8" y1="12" x2="16" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="15" x2="14" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      {/* 체크 표시 */}
      <path d="M8 9 L10 11 L13.5 7" stroke="#FFF46C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GovIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 기단 */}
      <rect x="3" y="19" width="18" height="2.5" rx="1" fill="#3C70FF"/>
      {/* 기둥 3개 */}
      <rect x="5.5" y="10" width="3" height="10" rx="1" fill="#3C70FF"/>
      <rect x="10.5" y="10" width="3" height="10" rx="1" fill="#3C70FF"/>
      <rect x="15.5" y="10" width="3" height="10" rx="1" fill="#3C70FF"/>
      {/* 기둥 위 가로 띠 */}
      <rect x="4" y="9" width="16" height="2" rx="1" fill="#8DFFC3"/>
      {/* 지붕 삼각형 */}
      <path d="M2 9.5 L12 3 L22 9.5 Z" fill="#FFF46C"/>
    </svg>
  );
}

export default function ScenarioIcon({ id, size = 26 }: { id: string; size?: number }) {
  if (id === "cafe")      return <CafeIcon size={size} />;
  if (id === "delivery")  return <DeliveryIcon size={size} />;
  if (id === "hospital")  return <HospitalIcon size={size} />;
  if (id === "interview") return <InterviewIcon size={size} />;
  if (id === "gov")       return <GovIcon size={size} />;
  return null;
}
