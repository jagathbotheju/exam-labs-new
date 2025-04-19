import { InferSelectModel } from "drizzle-orm";
import {
  doublePrecision,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { subjects } from "./subjects";
import { exams } from "./exams";
import { users } from "./users";

export const questionsYearHistory = pgTable(
  "questions_year_history",
  {
    examId: text("exam_id").references(() => exams.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .references(() => subjects.id, {
        onDelete: "cascade",
      })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    grade: text("grade").notNull(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    marks: doublePrecision("marks").default(0),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [
        table.month,
        table.year,
        table.subjectId,
        table.userId,
        table.grade,
      ],
    }),
  ]
);

export type QuestionsYearHistory = InferSelectModel<
  typeof questionsYearHistory
>;
