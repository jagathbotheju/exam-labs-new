import { InferSelectModel, relations } from "drizzle-orm";
import { timestamp, pgTable, text } from "drizzle-orm/pg-core";
import { UserExamExt, userExams } from "./userExams";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: text("role").default("user"),
  dob: timestamp("dob"),
  school: text("school"),
  grade: text("grade"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  userExams: many(userExams),
}));

export type User = InferSelectModel<typeof users>;
export type UserExt = InferSelectModel<typeof users> & {
  userExams: UserExamExt[];
};
