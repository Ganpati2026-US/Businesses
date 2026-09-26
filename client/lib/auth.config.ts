import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-nextauth-vercel-builds",
    providers: [],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.restaurantId = (user as any).restaurantId;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as string;
                (session.user as any).restaurantId = token.restaurantId as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt',
    },
};
