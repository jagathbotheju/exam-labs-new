import { useQuery } from "@tanstack/react-query";
import {
  getHistoryYears,
  getMonthHistoryData,
  getYearHistoryData,
} from "../actions/historyActions";

export const useHistoryYears = () => {
  return useQuery({
    queryKey: ["history-years"],
    queryFn: () => getHistoryYears(),
  });
};

export const useMonthHistoryData = ({
  subjectId,
  userId,
  year,
  month,
  grade,
}: {
  subjectId: string;
  userId: string;
  year: number;
  month: number;
  grade: string;
}) => {
  return useQuery({
    queryKey: ["month-history-data", subjectId, userId, year, month, grade],
    queryFn: () =>
      getMonthHistoryData({ subjectId, userId, year, month, grade }),
  });
};

export const useYearHistoryData = ({
  subjectId,
  userId,
  year,
  grade,
}: {
  subjectId: string;
  userId: string;
  year: number;
  grade: string;
}) => {
  return useQuery({
    queryKey: ["year-history-data", subjectId, userId, year, grade],
    queryFn: () => getYearHistoryData({ subjectId, userId, year, grade }),
  });
};
