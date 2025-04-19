import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const subjects = pgTable("subjects", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").unique().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export type Subject = InferSelectModel<typeof subjects>;
