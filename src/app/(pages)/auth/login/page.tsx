import LoginForm from "@/components/auth/LoginForm";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const { callbackUrl } = await searchParams;
  const session = await auth();
  const user = session?.user as User;

  if (user && user?.id) redirect("/");

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
};
export default LoginPage;
