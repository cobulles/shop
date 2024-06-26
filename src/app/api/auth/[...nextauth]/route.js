import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { signIn } from 'src/services/auth';
import { NEXTAUTH_SECRET } from 'src/config-global';

export const authOptions = {
  secret: NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Sign in with Email',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        /**
         * This function is used to define if the user is authenticated or not.
         * If authenticated, the function should return an object contains the user data.
         * If not, the function should return `null`.
         */
        if (credentials == null) return null;
        /**
         * credentials is defined in the config above.
         * We can expect it contains two properties: `email` and `password`
         */
        try {
          const { user, jwt } = await signIn({
            email: credentials.email,
            password: credentials.password,
          });
          return { ...user, jwt };
        } catch (error) {
          // Sign In Fail
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      const isSignIn = !!user;
      if (isSignIn) {
        token.id = user.id;
        token.jwt = user.jwt;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      session.id = token.id;
      session.jwt = token.jwt;
      session.user.firstname = token.firstname;
      session.user.lastname = token.lastname;
      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    maxAge: 5 * 60 * 60,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
