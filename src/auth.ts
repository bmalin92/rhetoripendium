import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/db";
import { mergeAnonymousProgress } from "@/lib/auth/merge-progress";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile?.sub && profile.email) {
        const dbUser = await prisma.user.upsert({
          where: { googleId: profile.sub },
          create: {
            googleId: profile.sub,
            email: profile.email,
            name: typeof profile.name === "string" ? profile.name : null,
            image: typeof profile.picture === "string" ? profile.picture : null,
          },
          update: {
            email: profile.email,
            name: typeof profile.name === "string" ? profile.name : null,
            image: typeof profile.picture === "string" ? profile.picture : null,
          },
        });

        token.userId = dbUser.id;

        await mergeAnonymousProgress(dbUser.id);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.userId === "string") {
        session.user.id = token.userId;
      }
      return session;
    },
  },
});
