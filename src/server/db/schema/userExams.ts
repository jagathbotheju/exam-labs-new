import {
  doublePrecision,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { User, users } from "./users";
import { ExamExt, exams } from "./exams";

export const userExams = pgTable(
  "user_exams",
  {
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    examId: text("exam_id")
      .references(() => exams.id, { onDelete: "cascade" })
      .notNull(),
    marks: doublePrecision("marks").default(0),
    duration: integer("duration").default(0),
    completedAt: timestamp("completed_at", { mode: "string" }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.examId] })]
);

export const userExamRelations = relations(userExams, ({ one }) => ({
  exams: one(exams, {
    fields: [userExams.examId],
    references: [exams.id],
  }),
  questions: one(users, {
    fields: [userExams.userId],
    references: [users.id],
  }),
}));

export type UserExam = InferSelectModel<typeof userExams>;
export type UserExamExt = InferSelectModel<typeof userExams> & {
  exams: ExamExt;
  users: User;
};
