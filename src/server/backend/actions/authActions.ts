"use server";
import { signIn } from "@/lib/auth";
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
