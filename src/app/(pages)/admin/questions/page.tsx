import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AllQuestions from "@/components/questions/AllQuestions";

export const metadata: Metadata = {
  title: {
    template: "All Questions",
    default: "All Questions",
  },
};

const QuestionsPage = async () => {
  const session = await auth();
  const user = session?.user as User;
  if (!user?.id) redirect("/auth/login");
  if (user && user.role !== "admin") return redirect("/not-authorized");

  return (
    <div className="flex flex-col border rounded-md border-primary/40 h-full p-4 w-full">
      <AllQuestions />
    </div>
  );
};
export default QuestionsPage;
