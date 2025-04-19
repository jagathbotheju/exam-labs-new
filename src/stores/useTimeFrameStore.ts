import { Period } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HistoryStore = {
  timeFrame: "month" | "year";
  period: Period;
  examStartTime: Date;
  setTimeFrame: (timeFrame: "month" | "year") => void;
  setPeriod: (period: Period) => void;
  setExamStartTime: (examStartTime: Date) => void;
};

export const useTimeFrameStore = create<HistoryStore>()(
  persist(
    (set) => ({
      timeFrame: "month",
      examStartTime: new Date(),
      period: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      setTimeFrame: (timeFrame) => {
        set(() => ({
          timeFrame,
        }));
      },

      setExamStartTime: (examStartTime) => {
        set(() => ({
          examStartTime,
        }));
      },

      setPeriod: (period) => {
        set(() => ({
          period,
        }));
      },
    }),
    {
      name: "history-store",
    }
  )
);
