import Results from "@/components/exams/Results";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "Results",
    default: "Results",
  },
};

const ResultsPage = async () => {
  const session = await auth();
  const user = session?.user as User;
  if (!user?.id) redirect("/auth/login");
  if (user && user.role !== "admin") return redirect("/not-authorized");

  return (
    <div className="flex w-full">
      <Results admin={user} />
    </div>
  );
};
export default ResultsPage;
