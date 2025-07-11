import IncorrectQuestions from "@/components/questions/IncorrectQuestions";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "Incorrect Answers",
    default: "Incorrect Answers",
  },
};

const IncorrectQuestionsPage = async () => {
  const session = await auth();
  const user = session?.user as User;

  if (!user?.id) redirect("/auth/login");
  if (user && user.role !== "admin") return redirect("/not-authorized");

  return (
    <div className="flex flex-col border rounded-md dark:border-primary/40 h-full p-4 w-full">
      <IncorrectQuestions />
    </div>
  );
};
export default IncorrectQuestionsPage;
