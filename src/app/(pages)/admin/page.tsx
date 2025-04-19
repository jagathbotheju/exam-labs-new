import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const session = await auth();
  const user = session?.user as User;
  if (!user?.id) redirect("/auth/login");
  if (user && user.role !== "admin") return redirect("/not-authorized");

  return (
    <div className="flex justify-center items-center w-full">
      <h1 className="font-semibold text-3xl mt-10 rounded-md bg-red-200 p-10 w-full mx-10 text-center text-muted-foreground">
        Admin Area,{" "}
        {user?.role !== "admin" && "you do not have Admin privileges"}
      </h1>
    </div>
  );
};
export default AdminPage;
