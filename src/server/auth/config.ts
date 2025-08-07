import type { DefaultSession, NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

// For debugging - remove in production
console.log('✅ Auth Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  AUTH_SECRET: process.env.AUTH_SECRET ? '✅ Set' : '❌ Missing',
  GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
  GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET
    ? '✅ Set'
    : '❌ Missing',
});

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  // Base path for auth routes
  // basePath: '/api/auth',
  // Enable debug logs in development
  // debug: process.env.NODE_ENV === 'development',
  secret: process.env.AUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig;
