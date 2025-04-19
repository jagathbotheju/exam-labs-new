import ExamDetails from "@/components/exams/ExamDetails";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

const ExamDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth();
  const user = session?.user as User;
  const { id } = await params;

  if (!user?.id) redirect("/auth/login");
  if (user && user.role !== "admin") return redirect("/not-authorized");

  return (
    <div className="flex flex-col gap-10 w-full">
      <ExamDetails examId={id} user={user} />
    </div>
  );
};
export default ExamDetailsPage;
