import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex items-center w-full flex-col gap-4">
      <h1 className="font-semibold text-3xl mt-10 rounded-md bg-red-200 p-10 w-full mx-10 text-center text-muted-foreground">
        No Authorized!, You are trying to access Admin Area
      </h1>
      <Button asChild className="self-end">
        <Link href="/">Home</Link>
      </Button>
    </div>
  );
};
export default page;
