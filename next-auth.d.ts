import { User } from "@/server/db/schema/users";
import { type DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & User;
    provider: string;
  }
}
