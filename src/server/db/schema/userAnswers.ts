import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { exams } from "./exams";
import { InferSelectModel, relations } from "drizzle-orm";
import { questions } from "./questions";
import { users } from "./users";

export const userAnswers = pgTable(
  "user-answers",
  {
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    examId: text("exam_id")
      .references(() => exams.id)
      .notNull()
      .notNull(),
    questionId: text("question_id")
      .references(() => questions.id)
      .notNull(),
    questionAnswer: text("question_answer"),
    userAnswer: text("user_answer"),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.examId, table.userId, table.questionId],
    }),
  ]
);

export const userAnswerRelations = relations(userAnswers, ({ one }) => ({
  exams: one(exams, {
    fields: [userAnswers.examId],
    references: [exams.id],
  }),
  users: one(users, {
    fields: [userAnswers.userId],
    references: [users.id],
  }),
}));

export type UserAnswer = InferSelectModel<typeof userAnswers>;
// export type UserAnswerExt = InferSelectModel<typeof userAnswers> & {
//   questionTypes: QuestionType;
// };
