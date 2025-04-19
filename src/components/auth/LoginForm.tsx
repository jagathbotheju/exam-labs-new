"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { socialSignIn } from "@/server/backend/actions/authActions";

interface Props {
  callbackUrl?: string;
}

const LoginForm = ({ callbackUrl }: Props) => {
  return (
    <div className="flex items-center justify-center flex-col w-full">
      <Card className="w-full md:w-[400px]">
        <CardHeader>
          <h1 className="mb-10 text-center text-3xl font-bold text-primary">
            Log In
          </h1>
        </CardHeader>
        <CardContent className="w-full flex flex-col gap-5 items-center">
          <p className="text-2xl font-bold text-secondary-foreground/70">
            LogIn with Google
          </p>

          {/* google login */}
          <Button
            type="button"
            className="w-full mb-3 bg-primary/20 cursor-pointer text-slate-800 hover:text-white"
            // variant="secondary"
            onClick={() =>
              socialSignIn({ social: "google", callback: callbackUrl ?? "/" })
            }
          >
            <div className="relative mr-2">
              <Image
                alt="google logo"
                src="/images/google-icon.svg"
                className="top-0 left-0 relative"
                width={20}
                height={20}
                sizes="100vw"
              />
            </div>
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
