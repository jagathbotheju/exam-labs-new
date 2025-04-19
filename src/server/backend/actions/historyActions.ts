"use server";
import { getDaysInMonth } from "date-fns";
import { HistoryData } from "@/lib/types";
import { db } from "@/server/db";
import {
  questionsMonthHistory,
  questionsYearHistory,
} from "@/server/db/schema";
import { QuestionsMonthHistory } from "@/server/db/schema/questionsMonthHistory";
import { and, asc, eq } from "drizzle-orm";
import _ from "lodash";

export const getMonthHistoryData = async ({
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
  console.log("grade", grade);
  const result = await db
    .select()
    .from(questionsMonthHistory)
    .orderBy(asc(questionsMonthHistory.day))
    .where(
      and(
        eq(questionsMonthHistory.subjectId, subjectId),
        eq(questionsMonthHistory.userId, userId),
        eq(questionsMonthHistory.month, month),
        eq(questionsMonthHistory.grade, grade)
      )
    );

  // await db.insert(questionsMonthHistory).values({
  //   examId: "4e2d5985-eddd-4454-90f0-65f19c2db747",
  //   studentId: "afe02058-8d03-4813-a5b3-ee202806952f",
  //   subjectId: "4edd48eb-1e17-41ac-adf4-40b9b07c17a4",
  //   marks: 62.5,
  //   day: 30,
  //   month: 11,
  //   year: 2024,
  // });

  if (!_.isEmpty(result)) {
    const history: HistoryData[] = [];
    const daysInMonth = getDaysInMonth(new Date(year, month));

    for (let i = 1; i <= daysInMonth; i++) {
      let marks = 0;
      const day = result.find((item) => item.day === i);
      if (day) {
        marks = day.marks || 0;
      }

      history.push({
        marks,
        year,
        month,
        day: i,
      });
    }

    // const marksTest = history.find((item) => item.day === 29) as HistoryData;
    return history;
  }

  return [];
};

export const getYearHistoryData = async ({
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
  const result = await db
    .select()
    .from(questionsYearHistory)
    .orderBy(asc(questionsYearHistory.month))
    .where(
      and(
        eq(questionsYearHistory.year, year),
        eq(questionsYearHistory.subjectId, subjectId),
        eq(questionsYearHistory.userId, userId),
        eq(questionsYearHistory.grade, grade)
      )
    );

  if (!_.isEmpty(result)) {
    const historyData: HistoryData[] = [];

    for (let i = 0; i < 12; i++) {
      let marks = 0;

      const month = result.find((item) => item.month === i);
      if (month && month.marks) {
        marks = marks < month.marks ? month.marks : marks;
      }

      historyData.push({
        year,
        month: i,
        marks,
      });
    }
    return historyData;
  }
  return [];
};

export const getHistoryYears = async () => {
  const result = (await db
    .selectDistinctOn([questionsMonthHistory.year])
    .from(questionsMonthHistory)
    .orderBy(asc(questionsMonthHistory.year))) as QuestionsMonthHistory[];

  if (result) {
    let years = result.map((item) => item.year);
    if (years.length === 0) {
      years = [new Date().getFullYear()];
    }
    return years;
  }
  return [];
};
