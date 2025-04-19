"use client";
import Link from "next/link";
import AuthButton from "./auth/AuthButton";
import { useCurrentUser } from "@/server/backend/queries/authQueries";

const Navbar = () => {
  const { data: currentUser } = useCurrentUser();

  return (
    <div className="border-b-[1.5px] border-b-primary sticky top-0 z-50 dark:bg-slate-900 bg-slate-50">
      <nav className="max-w-7xl mx-auto px-10 pt-6 pb-4">
        <ul className="flex justify-between items-center">
          <li>
            <Link href="/" className="relative flex gap-2 items-center">
              <h1 className="text-center bg-gradient-to-r from-orange-400 to-red-900 bg-clip-text text-5xl font-bold text-transparent font-protest tracking-wide">
                Exam
                <span className="text-red-900">Labs</span>
              </h1>
            </Link>
          </li>
          <li className="flex items-center gap-10">
            <p className="text-4xl font-bold text-primary">
              {currentUser?.grade ? currentUser.grade : ""}
            </p>
            <AuthButton user={currentUser} />
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Navbar;
