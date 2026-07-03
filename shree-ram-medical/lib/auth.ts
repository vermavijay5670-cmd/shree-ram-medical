import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "@/lib/data/users";
import type { Role } from "@/lib/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      businessName?: string;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        // NOTE: this checks against lib/data/users.ts (in-memory demo data).
        // A real build looks up the user in Postgres via Prisma and compares
        // a bcrypt hash — never plaintext, as done here for the scaffold.
        const user = getUserByEmail(email);
        if (!user || user.password !== password) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          businessName: user.businessName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as { role: Role }).role;
        token.businessName = (user as { businessName?: string }).businessName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.role = token.role as Role;
        session.user.businessName = token.businessName as string | undefined;
      }
      return session;
    },
  },
});
