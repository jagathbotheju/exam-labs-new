import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { Subject, subjects } from "./subjects";
import { ExamQuestion, examQuestions } from "./examQuestions";
// import { ExamExt } from "./exams";
// import { ExamQuestion } from "./examQuestions";

export const questions = pgTable("questions", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  body: text("body").notNull(),
  option1: text("option1"),
  option2: text("option2"),
  option3: text("option3"),
  option4: text("option4"),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  grade: text("grade").notNull(),
  term: text("term").notNull().default("all"),
  answer: text("answer").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const questionRelations = relations(questions, ({ one, many }) => ({
  subjects: one(subjects, {
    fields: [questions.subjectId],
    references: [subjects.id],
  }),
  examQuestions: many(examQuestions),
}));

export type Question = InferSelectModel<typeof questions>;
export type QuestionExt = InferSelectModel<typeof questions> & {
  subjects: Subject;
  examQuestions: ExamQuestion[];
  // exams: ExamExt[];
};
