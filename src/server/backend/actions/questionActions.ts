"use server";
import { auth } from "@/lib/auth";
import { AddMcqQuestionSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { examQuestions, incorrectQuestions } from "@/server/db/schema";
import { IncorrectQuestion } from "@/server/db/schema/incorrectQuestions";
import { Question, QuestionExt, questions } from "@/server/db/schema/questions";
import { userAnswers } from "@/server/db/schema/userAnswers";
import { User } from "@/server/db/schema/users";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import _ from "lodash";
import { ExamQuestion } from "@/server/db/schema/examQuestions";

// =====================mutations
export const addQuestion = async ({
  questionData,
  questionId,
}: {
  questionData: z.infer<typeof AddMcqQuestionSchema>;
  questionId?: string;
}) => {
  const session = await auth();
  const user = session?.user as User;
  if (!user) return { error: "Please LogIn" };
  if (user.role !== "admin") return { error: "Not Authorized!" };

  const isValid = AddMcqQuestionSchema.safeParse(questionData);

  if (isValid.success) {
    const validData = isValid.data;

    if (questionId) {
      const updatedQuestion = await db
        .update(questions)
        .set({
          body: validData.body,
          option1: validData.option1,
          option2: validData.option2,
          option3: validData.option3,
          option4: validData.option4,
          subjectId: validData.subject,
          grade: validData.grade,
          term: validData.term,
          answer: validData.answer,
          image: validData.image,
        })
        .where(eq(questions.id, questionId));
      if (updatedQuestion) {
        return { success: "Question updated successfully" };
      }
    } else {
      const newQuestion = await db.insert(questions).values({
        body: validData.body,
        option1: validData.option1,
        option2: validData.option2,
        option3: validData.option3,
        option4: validData.option4,
        answer: validData.answer,
        term: validData.term,
        grade: validData.grade,
        subjectId: validData.subject,
        image: validData.image,
      });
      if (newQuestion) return { success: "Question added successfully" };
    }
  }
  return {
    error: "Question could not be created/updated, please contact admin",
  };
};

export const addQuestionToExam = async ({
  questionId,
  questionNumber,
  examId,
}: {
  questionId: string;
  questionNumber: number;
  examId: string;
}) => {
  try {
    const questionExist = await db
      .select()
      .from(examQuestions)
      .where(
        and(
          eq(examQuestions.examId, examId),
          eq(examQuestions.questionId, questionId)
        )
      );
    if (questionExist.length)
      return { error: "Could not add, Question already exist" };

    const addedQuestion = await db
      .insert(examQuestions)
      .values({
        examId,
        questionId,
        questionNumber,
      })
      .returning();
    if (addedQuestion.length) {
      return { success: "Question added Successfully" };
    }
    return { error: "Could not add Question to Exam" };
  } catch (error) {
    console.log(error);
    return { error: "Could not add Question to Exam" };
  }
};

export const removeQuestionFromExam = async ({
  questionId,
  examId,
}: {
  questionId: string;
  examId: string;
}) => {
  try {
    const deletedQuestion = await db
      .delete(examQuestions)
      .where(
        and(
          eq(examQuestions.examId, examId),
          eq(examQuestions.questionId, questionId)
        )
      )
      .returning();
    if (deletedQuestion.length) {
      return { success: "Question deleted Successfully" };
    }
    return { error: "Could not delete Question from Exam" };
  } catch (error) {
    console.log(error);
    return { error: "Could not delete Question from Exam" };
  }
};

export const deleteQuestion = async (questionId: string) => {
  const deletedQuestion = await db
    .delete(examQuestions)
    .where(eq(examQuestions.questionId, questionId))
    .returning()
    .then(() => {
      return db
        .delete(questions)
        .where(eq(questions.id, questionId))
        .returning();
    });

  if (deletedQuestion) {
    return { success: "Question deleted Successfully" };
  }
};

export const answerQuestion = async ({
  examId,
  userId,
  questionId,
  userAnswer,
  questionAnswer,
}: {
  examId: string;
  userId: string;
  questionId: string;
  userAnswer: string;
  questionAnswer: string;
}) => {
  const answer = await db
    .insert(userAnswers)
    .values({
      userId,
      examId,
      questionId,
      questionAnswer,
      userAnswer,
    })
    .onConflictDoUpdate({
      target: [userAnswers.examId, userAnswers.userId, userAnswers.questionId],
      set: {
        userAnswer,
      },
    })
    .returning();

  //update incorrectQuestions
  let updatedIncorrect = [] as IncorrectQuestion[];
  const existIncorrect: IncorrectQuestion[] = await db
    .select()
    .from(incorrectQuestions)
    .where(
      and(
        eq(incorrectQuestions.questionId, questionId),
        eq(incorrectQuestions.userId, userId)
      )
    );

  if (!_.isEmpty(existIncorrect) && userAnswer === questionAnswer) {
    updatedIncorrect = await db
      .delete(incorrectQuestions)
      .where(
        and(
          eq(incorrectQuestions.questionId, questionId),
          eq(incorrectQuestions.userId, userId)
        )
      )
      .returning();
  } else if (_.isEmpty(existIncorrect) && userAnswer !== questionAnswer) {
    updatedIncorrect = await db
      .insert(incorrectQuestions)
      .values({
        userId,
        examId,
        questionId,
      })
      .returning();
  }

  if (!answer.length && !updatedIncorrect.length) {
    return { error: "Error answering this question" };
  }
};

//=====================queries
export const getQuestions = async () => {
  const allQuestions = await db
    .select()
    .from(questions)
    .orderBy(desc(questions.createdAt));
  return allQuestions as Question[];
};

export const getQuestionsCount = async ({
  subjectId,
  grade,
}: {
  subjectId: string;
  grade: string;
}) => {
  const questionsCount = await db
    .select({ count: count() })
    .from(questions)
    .where(and(eq(questions.subjectId, subjectId), eq(questions.grade, grade)));
  return questionsCount[0];
};

export const getQuestionsBySubject = async (subjectId: string) => {
  const questionsBySubject = await db.query.questions.findMany({
    with: {
      examQuestions: true,
      subjects: true,
    },
    where: eq(questions.subjectId, subjectId),
    orderBy: asc(questions.createdAt),
  });

  return questionsBySubject as QuestionExt[];
};

export const getQuestionsBySubjectPagination = async ({
  subjectId,
  grade,
  page,
  pageSize = 10,
}: {
  subjectId: string;
  grade: string;
  page: number;
  pageSize?: number;
}) => {
  const questionsBySubject = await db.query.questions.findMany({
    where: and(eq(questions.subjectId, subjectId), eq(questions.grade, grade)),
    with: {
      examQuestions: {
        with: {
          questions: true,
        },
      },
      subjects: true,
    },

    orderBy: asc(questions.createdAt),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return questionsBySubject as QuestionExt[];
};

export const getQuestionById = async (questionId: string) => {
  const questionById = await db
    .select()
    .from(questions)
    .where(eq(questions.id, questionId));
  return questionById as Question[];
};

export const getExamQuestions = async () => {
  const exams = await db.query.examQuestions.findMany({
    with: {
      exams: true,
    },
  });

  return exams as ExamQuestion[];
};

export const getIncorrectQuestions = async ({
  userId,
  subjectId,
}: {
  userId?: string;
  subjectId?: string;
}) => {
  if (!userId || !subjectId) return [];
  const incorrect = await db.query.incorrectQuestions.findMany({
    with: {
      questions: true,
    },
  });
  if (!_.isEmpty(incorrect)) {
    const questionsBySubject = incorrect.map((item) => {
      if (item.questions?.subjectId === subjectId) {
        return item.questions;
      }
    });
    return questionsBySubject as QuestionExt[];
  }

  return [];
};
