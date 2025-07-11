import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { Exam, exams } from "./exams";
import { InferSelectModel, relations } from "drizzle-orm";
import { QuestionExt, questions } from "./questions";
import { User, users } from "./users";
import { ExamQuestion } from "./examQuestions";
import { subjects } from "./subjects";

export const incorrectQuestions = pgTable(
  "incorrect_questions",
  {
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    examId: text("exam_id")
      .references(() => exams.id)
      .notNull(),
    subjectId: text("subject_id").references(() => subjects.id),
    grade: text("grade"),
    questionId: text("question_id")
      .references(() => questions.id)
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.questionId, table.examId],
    }),
  ]
);

export const incorrectQuestionRelations = relations(
  incorrectQuestions,
  ({ one }) => ({
    exams: one(exams, {
      fields: [incorrectQuestions.examId],
      references: [exams.id],
    }),
    users: one(users, {
      fields: [incorrectQuestions.userId],
      references: [users.id],
    }),
    questions: one(questions, {
      fields: [incorrectQuestions.questionId],
      references: [questions.id],
    }),
  })
);

export type IncorrectQuestion = InferSelectModel<typeof incorrectQuestions>;
export type IncorrectQuestionExt = InferSelectModel<
  typeof incorrectQuestions
> & {
  users: User;
  exams: Exam;
  questions: QuestionExt;
  examQuestions: ExamQuestion[];
};
