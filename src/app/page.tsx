import MyExams from "@/components/exams/MyExams";
import ResultSummaryLineChart from "@/components/exams/ResultSummaryLineChart";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const user = session?.user as User;

  if (!user?.id) redirect("/auth/login");
  if (user && user.role === "admin") redirect("/admin");

  if (!user?.school || !user.grade) {
    redirect("/user/profile");
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <ResultSummaryLineChart user={user} />
        <MyExams user={user} />
      </div>
    </div>
  );
}
