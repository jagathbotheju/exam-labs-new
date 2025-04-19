import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users, accounts } from "@/server/db/schema";
import { User } from "@/server/db/schema/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      const tokenUser = token.user as User;
      if (tokenUser) {
        session.user = tokenUser;
      }

      if (!tokenUser || !tokenUser.id) {
        if (token && token.sub) {
          const userDB = await db.query.users.findFirst({
            where: eq(users.email, token.email as string),
          });
          if (userDB) {
            session.user = userDB;
          }
        }
      }

      const provider = token.provider as string;
      session.provider = provider;

      return session;
    },
    async jwt({ token }) {
      if (token && token.sub) {
        const userDB = await db.query.users.findFirst({
          where: eq(users.id, token.sub),
        });
        const provider = await db.query.accounts.findFirst({
          where: eq(accounts.userId, token.sub),
        });
        token.user = userDB;
        token.provider = provider;
      }

      return token;
    },
  },
});
