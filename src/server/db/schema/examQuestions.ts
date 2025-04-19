import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { ExamExt, exams } from "./exams";
import { Question, questions } from "./questions";
import { InferSelectModel, relations } from "drizzle-orm";

export const examQuestions = pgTable(
  "exam-questions",
  {
    examId: text("exam_id")
      .references(() => exams.id)
      .notNull(),
    questionId: text("question_id")
      .references(() => questions.id)
      .notNull(),
    questionNumber: integer("question_number"),
  },
  (table) => [primaryKey({ columns: [table.examId, table.questionId] })]
);

export const examQuestionsRelations = relations(examQuestions, ({ one }) => ({
  exams: one(exams, {
    fields: [examQuestions.examId],
    references: [exams.id],
  }),
  questions: one(questions, {
    fields: [examQuestions.questionId],
    references: [questions.id],
  }),
}));

export type ExamQuestion = InferSelectModel<typeof examQuestions> & {
  exams: ExamExt;
  questions: Question;
};
