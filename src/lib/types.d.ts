export type UserResponse = {
  questionId: string;
  userAnswer: string;
  questionAnswer: string;
};

type TimeFrame = "month" | "year";

type Period = {
  year: number;
  month: number;
};

type HistoryData = {
  marks: number;
  year: number;
  month: number;
  day?: number;
};
