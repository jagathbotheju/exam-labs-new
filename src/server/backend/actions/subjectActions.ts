"use server";
import { db } from "@/server/db";
import { Subject, subjects } from "@/server/db/schema/subjects";
import { desc, eq } from "drizzle-orm";

//========================queries
export const getSubjects = async () => {
  const allSubjects = await db
    .select()
    .from(subjects)
    .orderBy(desc(subjects.title));
  return allSubjects as Subject[];
};

export const getSubjectById = async (subjectId: string) => {
  const subject = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, subjectId));
  if (subject) return subject[0] as Subject;
  return null;
};

//========================mutations
export const addSubject = async ({ title }: { title: string }) => {
  try {
    const newSubject = await db.insert(subjects).values({ title });
    if (newSubject) {
      return { success: "Subject created successfully" };
    }
  } catch (error) {
    console.log(error);
    return { error: "Could not add subject" };
  }
};

export const deleteSubject = async (subjectId: string) => {
  try {
    const deletedSubject = await db
      .delete(subjects)
      .where(eq(subjects.id, subjectId));
    if (deletedSubject) {
      return { success: "Subject deleted successfully" };
    }
  } catch (error) {
    console.log(error);
    return { error: "Could not delete subject" };
  }
};
