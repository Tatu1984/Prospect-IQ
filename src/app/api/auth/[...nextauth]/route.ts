import { NextRequest } from "next/server";
import { Auth } from "@auth/core";
import Google from "@auth/core/providers/google";
import Credentials from "@auth/core/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const config = {
  trustHost: true,
  basePath: "/api/auth",
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email as string } });
        if (!user || !user.hashedPassword) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.hashedPassword);
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  events: {
    async createUser({ user }: { user: { id?: string } }) {
      if (user.id) {
        await prisma.user.update({ where: { id: user.id }, data: { creditsBalance: 50 } });
      }
    },
  },
  callbacks: {
    async jwt({ token, user }: { token: Record<string, unknown>; user?: { id?: string } }) {
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
    async session({ session, token }: { session: Record<string, unknown>; token: Record<string, unknown> }) {
      const user = session.user as Record<string, unknown>;
      if (user) {
        user.id = token.id;
        user.image = token.picture;
        user.role = token.role;
        user.purpose = token.purpose;
        user.creditsBalance = token.creditsBalance;
      }
      return session;
    },
  },
};

async function handler(req: NextRequest): Promise<Response> {
  const request = new Request(req.url, {
    method: req.method,
    headers: req.headers,
    body: req.method === "POST" ? req.body : undefined,
    // @ts-expect-error duplex needed for streaming body
    duplex: req.method === "POST" ? "half" : undefined,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await Auth(request, config as any);
  return response as Response;
}

export { handler as GET, handler as POST };
