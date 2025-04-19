import Profile from "@/components/user/Profile";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "Profile",
    default: "Profile",
  },
};

const ProfilePage = async () => {
  const session = await auth();
  const user = session?.user as User;
  if (!user || !session) {
    redirect("/auth/login");
  }

  return (
    <div className="w-full flex flex-col gap-5">
      {(!user.school || !user.grade) && (
        <div className="flex flex-col items-center w-full mx-auto p-10 bg-red-100 rounded-2xl h-fit">
          <h1 className="font-semibold text-3xl text-red-400">
            Update Your Profile!
          </h1>
          <p className="text-xl text-muted-foreground">
            Please update school and grade
          </p>
        </div>
      )}

      <Profile user={user} />
    </div>
  );
};
export default ProfilePage;
