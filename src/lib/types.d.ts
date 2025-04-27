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
  subjectId: string;
};

type ChartData = {
  year: number;
  month: number;
  day?: number;
  // subject: string;
};

type MonthHistoryData = {
  marks: number;
  year: number;
  month: number;
  day?: number;
  subject: string;
};
