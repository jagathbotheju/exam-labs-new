"use server";
import { ProfileSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { UserExt, users } from "@/server/db/schema/users";

export const updateUserProfile = async ({
  formData,
  userId,
}: {
  formData: z.infer<typeof ProfileSchema>;
  userId: string;
}) => {
  const validData = ProfileSchema.safeParse(formData);
  if (validData.success) {
    await db
      .update(users)
      .set({
        ...validData.data,
      })
      .where(eq(users.id, userId));
  }
};

export const getUsers = async () => {
  const users = await db.query.users.findMany({
    with: {
      userExams: true,
    },
  });
  return users as UserExt[];
};

export const getUserById = async (userId: string) => {
  const user = await db.select().from(users).where(eq(users.id, userId));
  return user[0] as UserExt;
};
