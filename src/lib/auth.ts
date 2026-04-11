import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import LinkedIn from "next-auth/providers/linkedin";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const { auth, signIn, signOut } = NextAuth({
  trustHost: true,
  basePath: "/api/auth",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Email linking is intentional for OAuth-first signup UX.
      // Mitigated by: OAuth providers verify the email themselves before issuing tokens.
      allowDangerousEmailAccountLinking: true,
    }),
    ...(process.env.FACEBOOK_CLIENT_ID ? [Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      // Email linking is intentional for OAuth-first signup UX.
      // Mitigated by: OAuth providers verify the email themselves before issuing tokens.
      allowDangerousEmailAccountLinking: true,
    })] : []),
    ...(process.env.LINKEDIN_CLIENT_ID ? [LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      // Email linking is intentional for OAuth-first signup UX.
      // Mitigated by: OAuth providers verify the email themselves before issuing tokens.
      allowDangerousEmailAccountLinking: true,
    })] : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.hashedPassword) return null;
        const valid = await bcrypt.compare(password, user.hashedPassword);
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { id: true, name: true, email: true, image: true, role: true, purpose: true, creditsBalance: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.purpose = dbUser.purpose;
          token.creditsBalance = dbUser.creditsBalance;
          token.picture = dbUser.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.picture as string | null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = session.user as any;
        user.role = token.role;
        user.purpose = token.purpose;
        user.creditsBalance = token.creditsBalance;
      }
      return session;
    },
  },
});
