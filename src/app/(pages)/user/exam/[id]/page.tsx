import UserExam from "@/components/exams/UserExam";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

const UserExamPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth();
  const user = session?.user as User;
  const { id: examId } = await params;
  if (!user) redirect("/auth/login");

  return (
    <div className="w-full">
      <UserExam examId={examId} />
    </div>
  );
};
export default UserExamPage;
