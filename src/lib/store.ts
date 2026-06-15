"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HistoryRecord = {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  level: number;
  score: number;
  praise: string[];
  improve: string[];
  hintsUsed: number;
  date: string;
};

type Store = {
  nickname: string;
  anxietyType: string;
  progress: Record<string, number>; // scenarioId -> highest level completed
  history: HistoryRecord[];
  streakDays: number;
  alarmOn: boolean;
  alarmAmpm: "오전" | "오후";
  alarmHour: number;
  alarmMinute: number;
  setNickname: (n: string) => void;
  setAnxietyType: (t: string) => void;
  addRecord: (r: HistoryRecord) => void;
  getLevelProgress: (scenarioId: string) => number;
  setAlarmOn: (on: boolean) => void;
  setAlarmTime: (ampm: "오전" | "오후", hour: number, minute: number) => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      nickname: "",
      anxietyType: "",
      progress: {},
      history: [],
      streakDays: 3,
      alarmOn: true,
      alarmAmpm: "오후",
      alarmHour: 8,
      alarmMinute: 0,
      setNickname: (n) => set({ nickname: n }),
      setAnxietyType: (t) => set({ anxietyType: t }),
      addRecord: (r) =>
        set((s) => {
          const prevProgress = s.progress[r.scenarioId] ?? 0;
          return {
            history: [r, ...s.history],
            progress: {
              ...s.progress,
              [r.scenarioId]: Math.max(prevProgress, r.level),
            },
          };
        }),
      getLevelProgress: (scenarioId) => get().progress[scenarioId] ?? 0,
      setAlarmOn: (on) => set({ alarmOn: on }),
      setAlarmTime: (ampm, hour, minute) => set({ alarmAmpm: ampm, alarmHour: hour, alarmMinute: minute }),
    }),
    { name: "callphobia-proto" }
  )
);
