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
}: {
  subjectId: string;
  userId: string;
  year: number;
  month: number;
}) => {
  return useQuery({
    queryKey: ["month-history-data", subjectId, userId, year, month],
    queryFn: () => getMonthHistoryData({ subjectId, userId, year, month }),
  });
};

export const useYearHistoryData = ({
  subjectId,
  userId,
  year,
}: {
  subjectId: string;
  userId: string;
  year: number;
}) => {
  return useQuery({
    queryKey: ["year-history-data", subjectId, userId, year],
    queryFn: () => getYearHistoryData({ subjectId, userId, year }),
  });
};
