import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { getUserByEmail } from "./lib/actions/user.actions";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { prisma } from "./lib/prisma";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new CredentialsSignin("Please provide both email & Password.");
        }

        const user = await getUserByEmail(email);

        if (!user) {
          throw new CredentialsSignin("Invalid email or password.");
        }

        if (!user.password) {
          throw new CredentialsSignin("Invalid email or password.");
        }

        const isMatched = await compare(password, user.password);

        if (!isMatched) {
          throw new CredentialsSignin("Invalid email or password.");
        }
        console.log("user pass matched");

        const userData = {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
        };

        return userData;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  events: {
    async linkAccount({ user }) {
      const str = user.email!.slice(0, user.email!.indexOf("@") + 1);
      const lower = str.toLowerCase();
      const username = lower.replace(/[^A-Za-z0-9-_]/g, "");

      await prisma.user.update({
        where: { email: user.email as string },
        data: { username: username as string },
      });
    },
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && token?.username) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
