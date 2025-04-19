"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <div className="flex gap-5 w-full">
      <div className="flex flex-col gap-4 w-[200px] h-full p-5 rounded-md border border-primary/40">
        {/* all questions */}
        <Button
          asChild
          className={cn(
            pathname === "/admin/questions"
              ? "bg-primary text-black font-semibold"
              : "bg-transparent"
          )}
          variant={pathname === "/admin/questions" ? "default" : "outline"}
        >
          <Link href="/admin/questions">All Questions</Link>
        </Button>

        {/* incorrect answers */}
        <Button
          asChild
          className={cn(
            pathname === "/admin/incorrect-answers"
              ? "bg-primary text-black font-semibold"
              : "bg-transparent"
          )}
          variant={
            pathname === "/admin/incorrect-answers" ? "default" : "outline"
          }
        >
          <Link href="/admin/incorrect-answers">Incorrect Answers</Link>
        </Button>

        {/* add MCQ */}
        <Button
          asChild
          className={cn(
            pathname === "/admin/questions/add/mcq"
              ? "bg-primary text-black font-semibold"
              : "bg-transparent"
          )}
          variant={
            pathname === "/admin/questions/add/mcq" ? "default" : "outline"
          }
        >
          <Link href="/admin/questions/add/mcq">Add MCQ</Link>
        </Button>

        {/* subjects */}
        <Button
          asChild
          className={cn(
            pathname === "/admin/subjects"
              ? "bg-primary text-black font-semibold"
              : "bg-transparent"
          )}
          variant={pathname === "/admin/subjects" ? "default" : "outline"}
        >
          <Link href="/admin/subjects">Subjects</Link>
        </Button>

        {/* exams */}
        <Button
          asChild
          className={cn(
            pathname === "/admin/exams"
              ? "bg-primary text-black font-semibold"
              : "bg-transparent"
          )}
          variant={pathname === "/admin/exams" ? "default" : "outline"}
        >
          <Link href="/admin/exams">Exams</Link>
        </Button>

        {/* results */}
        <Button
          asChild
          className={cn(
            pathname === "/admin/results"
              ? "bg-primary text-black font-semibold"
              : "bg-transparent"
          )}
          variant={pathname === "/admin/results" ? "default" : "outline"}
        >
          <Link href="/admin/results">Results</Link>
        </Button>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
export default AdminLayout;
