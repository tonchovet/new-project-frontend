/* ----------------------------------------------------------
 *  NextAuth configuration for the App‑Router
 * ---------------------------------------------------------- */
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  /* ----------------------------------------------------------------
   *  1️⃣  Providers – Google (OAuth) + Credentials (email/password)
   * ---------------------------------------------------------------- */
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: { scope: 'openid profile email' },
      },
    }),

    // ⚠️  Change the authorize() body below to hit your own backend.
    //     The example calls `${process.env.BACKEND_URL}/api/auth/login`
    //     – it expects a 200 response with a JSON object containing
    //     at least `{ id, email, name, picture }`.
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // 👇  Replace this with your real authentication endpoint
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          },
        );

        const user = await response.json();

        // The `authorize()` function must return a user object
        // (or `null` if authentication failed).
        if (response.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],

  /* ----------------------------------------------------------------
   *  2️⃣  Session handling – keep the token in a signed cookie
   * ---------------------------------------------------------------- */
  session: { strategy: 'jwt' },

  /* ----------------------------------------------------------------
   *  3️⃣  Callbacks – propagate the user’s id & email into the JWT
   * ---------------------------------------------------------------- */
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
      };
      return session;
    },
  },

  /* ----------------------------------------------------------------
   *  4️⃣  Custom pages – we override the default sign‑in page
   * ---------------------------------------------------------------- */
  pages: {
    signIn: '/login',      // <-- our new login page
  },

  /* ----------------------------------------------------------------
   *  5️⃣  Secret used by NextAuth to sign cookies/JWTs
   * ---------------------------------------------------------------- */
  secret: process.env.NEXTAUTH_SECRET,
};

export const { GET, POST } = NextAuth(authOptions);
