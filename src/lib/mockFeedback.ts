export function buildFeedback(turnsCompleted: number, hintsUsed: number, total: number) {
  const ratio = turnsCompleted / total;
  const base = Math.round(ratio * 100);
  const score = Math.max(55, Math.min(100, base - hintsUsed * 5));

  const praisePool = [
    "대화를 끝까지 완주했어요!",
    "침묵 없이 자연스럽게 이어나갔어요.",
    "핵심 정보를 빠짐없이 전달했어요.",
    "상대방의 말을 잘 이해하고 반응했어요.",
    "목소리 톤이 안정적이었어요.",
  ];
  const improvePool = [
    "좀 더 구체적인 표현을 써보세요.",
    "주소나 이름은 또박또박 말하는 연습을 해보세요.",
    "마무리 인사를 명확하게 해보세요.",
    "첫 마디를 더 자신감 있게 시작해 보세요.",
  ];

  const praise = shuffle(praisePool).slice(0, hintsUsed < 2 ? 3 : 2);
  const improve = shuffle(improvePool).slice(0, hintsUsed < 2 ? 1 : 2);

  return { score, praise, improve };
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
