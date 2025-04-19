import AddMcqQuestion from "@/components/questions/AddMcqQuestion";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "Add MCQ Question",
    default: "Add MCQ Question",
  },
};

const AddMcqQuestionPage = async () => {
  const session = await auth();
  const user = session?.user as User;

  if (!user?.id) redirect("/auth/login");
  if (user && user.role !== "admin") return redirect("/not-authorized");

  return (
    <div className="flex flex-col border rounded-md border-primary/40 h-full p-4 w-full">
      <AddMcqQuestion />
    </div>
  );
};
export default AddMcqQuestionPage;
