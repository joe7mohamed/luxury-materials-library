// src/lib/auth/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../db/connection";
import User from "../db/models/user";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export type ExtendedUser = {
  id: string;
  name: string;
  email: string;
  userType: "projectOwner" | "supplier" | "admin";
  isActive: boolean;
};

// Extend the default session
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("No user found with this email");

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) throw new Error("Invalid credentials");

        if (user.userType === "supplier" && !user.isActive) {
          throw new Error("Your account is pending approval");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          userType: user.userType,
          isActive: user.isActive,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.userType = user.userType;
        token.isActive = user.isActive;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          userType: token.userType as "projectOwner" | "supplier" | "admin",
          isActive: token.isActive as boolean,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
