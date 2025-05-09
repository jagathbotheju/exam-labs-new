import { InferSelectModel, relations } from "drizzle-orm";
import {
  doublePrecision,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { exams } from "./exams";
import { subjects } from "./subjects";
import { users } from "./users";

export const questionsMonthHistory = pgTable(
  "questions_month_history",
  {
    examId: text("exam_id").references(() => exams.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    subjectId: text("subject_id")
      .references(() => subjects.id, {
        onDelete: "cascade",
      })
      .notNull(),
    grade: text("grade").notNull(),
    marks: doublePrecision("marks").default(0),
    day: integer("day").notNull().notNull(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [
        table.day,
        table.month,
        table.year,
        table.subjectId,
        table.userId,
        table.grade,
      ],
    }),
  ]
);

export const questionsMonthHistoryRelations = relations(
  questionsMonthHistory,
  ({ one }) => ({
    subjects: one(subjects, {
      fields: [questionsMonthHistory.subjectId],
      references: [subjects.id],
    }),
  })
);

export type QuestionsMonthHistory = InferSelectModel<
  typeof questionsMonthHistory
>;

export type QuestionsMonthHistoryExt = InferSelectModel<
  typeof questionsMonthHistory
> & {
  subjects: {
    id: string;
    name: string;
  };
};
