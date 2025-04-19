import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { Subject, subjects } from "./subjects";
import { ExamQuestion, examQuestions } from "./examQuestions";
import { UserExamExt, userExams } from "./userExams";
import { UserAnswer, userAnswers } from "./userAnswers";

export const exams = pgTable("exams", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  subjectId: text("subject_id")
    .references(() => subjects.id)
    .notNull(),
  grade: text("grade"),
  duration: integer("duration"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const examRelations = relations(exams, ({ one, many }) => ({
  userExams: many(userExams),
  examQuestions: many(examQuestions),
  userAnswers: many(userAnswers),

  subjects: one(subjects, {
    fields: [exams.subjectId],
    references: [subjects.id],
  }),
}));

export type Exam = InferSelectModel<typeof exams>;
export type ExamExt = InferSelectModel<typeof exams> & {
  subjects: Subject;
  userExams: UserExamExt[];
  examQuestions: ExamQuestion[];
  userAnswers: UserAnswer[];
};
