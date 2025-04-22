"use server";
import { auth, signIn } from "@/lib/auth";
import { UserExt } from "@/server/db/schema/users";
import { revalidatePath } from "next/cache";

export const socialSignIn = async ({
  social,
  callback,
}: {
  social: string;
  callback: string;
}) => {
  await signIn(social, { redirectTo: callback }).then(() => {
    revalidatePath("/");
  });
};

export const getCurrentUser = async () => {
  const session = await auth();
  const user = session?.user as UserExt;
  return user ? user : ({} as UserExt);
};
