"use server";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { userAnswers } from "@/server/db/schema";
import { UserAnswer } from "@/server/db/schema/userAnswers";

export const getUserAnswers = async ({
  examId,
  userId,
}: {
  examId: string;
  userId: string;
}) => {
  const answers = await db.query.userAnswers.findMany({
    where: and(eq(userAnswers.examId, examId), eq(userAnswers.userId, userId)),
  });

  return answers as UserAnswer[];
};
