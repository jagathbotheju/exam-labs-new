"use server";
import { AddExamSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import _ from "lodash";
import {
  exams,
  questionsMonthHistory,
  questionsYearHistory,
  userAnswers,
  userExams,
  users,
} from "@/server/db/schema";
import { ExamExt } from "@/server/db/schema/exams";
import { UserExam, UserExamExt } from "@/server/db/schema/userExams";
import { QuestionsMonthHistory } from "@/server/db/schema/questionsMonthHistory";
import { QuestionsYearHistory } from "@/server/db/schema/questionsYearHistory";
import { User } from "@/server/db/schema/users";

//=============queries======================================================
export const getExamsBySubjectGrade = async ({
  subjectId,
  grade,
}: {
  subjectId: string;
  grade: string;
}) => {
  const exam = await db.query.exams.findMany({
    where: and(eq(exams.subjectId, subjectId), eq(exams.grade, grade)),
    with: {
      examQuestions: {
        with: {
          questions: true,
        },
      },
      subjects: true,
    },
    orderBy: desc(exams.createdAt),
  });

  return exam as ExamExt[];
};

export const getExamById = async (examId: string) => {
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
    with: {
      examQuestions: {
        with: {
          questions: true,
        },
      },
      subjects: true,
      userExams: true,
    },
  });

  return exam as ExamExt;
};

export const getExams = async () => {
  const allExams = await db.query.exams.findMany({
    with: {
      // questions: true,
      examQuestions: true,
      subjects: true,
    },
    orderBy: desc(exams.createdAt),
  });
  return allExams as ExamExt[];
};

export const getUserExamsByGrade = async ({
  userId,
  grade,
}: {
  userId: string;
  grade: string;
}) => {
  const exams = await db.query.userExams.findMany({
    where: and(eq(userExams.userId, userId), eq(userExams.grade, grade)),
    with: {
      exams: {
        with: {
          userAnswers: true,
          examQuestions: {
            with: {
              questions: true,
            },
          },
          subjects: true,
        },
      },
    },
  });

  return exams as UserExamExt[];
};

export const getUserExamsPagination = async ({
  userId,
  page,
  grade,
  pageSize = 10,
}: {
  userId: string;
  page: number;
  grade: string;
  pageSize?: number;
}) => {
  const exams = await db.query.userExams.findMany({
    where: and(eq(userExams.userId, userId), eq(userExams.grade, grade)),
    with: {
      exams: {
        with: {
          userAnswers: true,
          examQuestions: {
            with: {
              questions: true,
            },
          },
          subjects: true,
        },
      },
    },
    orderBy: [desc(userExams.completedAt)],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
  return exams as UserExamExt[];
};

export const getUserExamsCount = async (userId: string) => {
  const examsCount = await db
    .select({ count: count() })
    .from(userExams)
    .where(eq(userExams.userId, userId));

  return examsCount[0];
};

export const getUserExam = async ({
  userId,
  examId,
}: {
  userId: string;
  examId: string;
}) => {
  const exam = await db
    .select()
    .from(userExams)
    .where(and(eq(userExams.userId, userId), eq(userExams.examId, examId)));

  return exam[0] as UserExam;
};

//==============mutations====================================================
export const addExam = async ({
  examData,
}: {
  examData: z.infer<typeof AddExamSchema>;
}) => {
  const isValid = AddExamSchema.safeParse(examData);
  try {
    if (isValid.success) {
      const validData = isValid.data;
      const newExam = await db.insert(exams).values({
        name: validData.name,
        subjectId: validData.subject,
        duration: validData.duration,
        grade: validData.grade,
      });
      if (newExam) {
        return { success: "Exam created successfully" };
      }
    } else {
      return { error: "Could not add exam" };
    }
  } catch (error) {
    console.log(error);
    return { error: "Could not add exam" };
  }
};

export const deleteExam = async (examId: string) => {
  try {
    // const deletedExamQuestions = await db
    //   .delete(examQuestions)
    //   .where(eq(examQuestions.examId, examId))
    //   .returning();

    const deletedExam = await db
      .delete(exams)
      .where(eq(exams.id, examId))
      .returning();

    if (!_.isEmpty(deletedExam))
      return { success: "Exam deleted successfully" };
    return { error: "Could not delete Exam" };
  } catch (error) {
    console.log(error);
    return { error: "Could not delete Exam" };
  }
};

export const deleteExamFromUser = async ({
  examId,
  userId,
}: {
  examId: string;
  userId: string;
}) => {
  try {
    const deletedExam = await db
      .delete(userExams)
      .where(and(eq(userExams.userId, userId), eq(userExams.examId, examId)))
      .returning();

    const deletedUserAnswers = await db
      .delete(userAnswers)
      .where(
        and(eq(userAnswers.examId, examId), eq(userAnswers.userId, userId))
      )
      .returning();

    const deletedYearHistory = await db
      .delete(questionsYearHistory)
      .where(
        and(
          eq(questionsYearHistory.examId, examId),
          eq(questionsYearHistory.userId, userId)
        )
      )
      .returning();

    const deletedMonthHistory = await db
      .delete(questionsMonthHistory)
      .where(
        and(
          eq(questionsMonthHistory.examId, examId),
          eq(questionsMonthHistory.userId, userId)
        )
      )
      .returning();

    if (
      deletedExam &&
      deletedUserAnswers &&
      deletedYearHistory &&
      deletedMonthHistory
    )
      return { success: "Exam deleted successfully" };
    return { error: "Exam could not be deleted" };
  } catch (error) {
    console.log(error);
    return { error: "Exam could not be deleted" };
  }
};

export const cancelUserExam = async ({
  examId,
  userId,
}: {
  examId: string;
  userId: string;
}) => {
  const deletedAnswers = await db
    .delete(userAnswers)
    .where(and(eq(userAnswers.examId, examId), eq(userAnswers.userId, userId)))
    .returning();
  if (deletedAnswers) return { success: "Exam cancelled successfully" };
  return { error: "Exam could not be deleted" };
};

export const addExamToUser = async ({
  userId,
  examId,
  grade,
}: {
  userId: string;
  examId: string;
  grade: string;
}) => {
  try {
    const examExist = await db
      .select()
      .from(userExams)
      .where(and(eq(userExams.examId, examId), eq(userExams.userId, userId)));
    if (examExist.length) return { error: "Could not add, Exam already exist" };

    const addedExam = await db
      .insert(userExams)
      .values({
        examId,
        userId,
        grade,
      })
      .returning();
    if (addedExam.length) {
      return { success: "Exam added Successfully" };
    }
    return { error: "Could not assign Exam to Student" };
  } catch (error) {
    console.log(error);
    return { error: "Could not assign Exam to Student" };
  }
};

export const completeExamAction = async ({
  examId,
  subjectId,
  userId,
  completedAt,
  marks,
  duration,
  grade,
}: {
  examId: string;
  subjectId: string;
  userId: string;
  completedAt: string;
  marks: number;
  duration: number;
  grade: string;
}) => {
  try {
    const user = (await db
      .select()
      .from(users)
      .where(eq(users.id, userId))) as User[];

    const completedUserExam = await db
      .update(userExams)
      .set({
        completedAt,
        marks,
        duration,
      })
      .where(and(eq(userExams.examId, examId), eq(userExams.userId, userId)))
      .returning();

    const date = new Date();
    const monthHistoryExist = await db
      .select()
      .from(questionsMonthHistory)
      .where(
        and(
          eq(questionsMonthHistory.day, date.getUTCDate()),
          eq(questionsMonthHistory.month, date.getUTCMonth() + 1),
          eq(questionsMonthHistory.year, date.getUTCFullYear()),
          eq(questionsMonthHistory.subjectId, subjectId),
          eq(questionsMonthHistory.userId, userId),
          eq(questionsMonthHistory.grade, grade)
        )
      );
    const yearHistoryExist = await db
      .select()
      .from(questionsYearHistory)
      .where(
        and(
          eq(questionsYearHistory.month, date.getUTCMonth()),
          eq(questionsYearHistory.year, date.getUTCFullYear()),
          eq(questionsYearHistory.subjectId, subjectId),
          eq(questionsYearHistory.userId, userId),
          eq(questionsYearHistory.grade, grade)
        )
      );

    // update month history
    let monthHistory = [] as QuestionsMonthHistory[];
    if (!_.isEmpty(monthHistoryExist)) {
      const existMarks = monthHistoryExist[0].marks ?? 0;
      monthHistory = await db
        .update(questionsMonthHistory)
        .set({
          marks: existMarks < marks ? marks : existMarks,
        })
        .where(
          and(
            eq(questionsMonthHistory.day, date.getUTCDate()),
            eq(questionsMonthHistory.month, date.getUTCMonth() + 1),
            eq(questionsMonthHistory.year, date.getUTCFullYear()),
            eq(questionsMonthHistory.subjectId, subjectId),
            eq(questionsMonthHistory.grade, grade)
          )
        )
        .returning();
    } else {
      monthHistory = await db
        .insert(questionsMonthHistory)
        .values({
          examId,
          userId,
          subjectId,
          marks,
          grade,
          day: date.getUTCDate(),
          month: date.getUTCMonth() + 1,
          year: date.getUTCFullYear(),
        })
        .returning();
    }

    // update year history
    let yearHistory = [] as QuestionsYearHistory[];
    if (!_.isEmpty(yearHistoryExist)) {
      const existMarks = yearHistoryExist[0].marks ?? 0;
      yearHistory = await db
        .update(questionsYearHistory)
        .set({
          marks: existMarks < marks ? marks : existMarks,
        })
        .where(
          and(
            eq(questionsYearHistory.month, date.getUTCMonth()),
            eq(questionsYearHistory.year, date.getUTCFullYear()),
            eq(questionsYearHistory.subjectId, subjectId),
            eq(questionsYearHistory.userId, userId),
            eq(questionsYearHistory.grade, grade)
          )
        )
        .returning();
    } else {
      yearHistory = await db
        .insert(questionsYearHistory)
        .values({
          examId,
          userId,
          subjectId,
          grade,
          marks,
          month: date.getUTCMonth() + 1,
          year: date.getUTCFullYear(),
        })
        .returning();
    }

    if (
      !_.isEmpty(completedUserExam) &&
      !_.isEmpty(monthHistory) &&
      !_.isEmpty(yearHistory)
    ) {
      return {
        success: "Exam completed successfully",
        data: {
          examId: completedUserExam[0].examId,
          userId: completedUserExam[0].userId,
          user: user[0],
        },
      };
    }

    return { error: "Error completing Exam" };
  } catch (error) {
    console.log(error);
    return { error: "Error completing Exam" };
  }
};
