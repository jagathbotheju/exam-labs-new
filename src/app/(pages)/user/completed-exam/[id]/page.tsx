import UserExam from "@/components/exams/UserExam";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

const UserCompletedExamPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role: string }>;
}) => {
  const session = await auth();
  const user = session?.user as User;
  const { id } = await params;
  const { role } = await searchParams;

  if (!user) redirect("/auth/login");
  if (user.role !== role) redirect("/not-authorized");

  return (
    <div className="w-full">
      <UserExam examId={id} completed />
    </div>
  );
};
export default UserCompletedExamPage;
