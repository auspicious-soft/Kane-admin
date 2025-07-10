import axios from "axios";
import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ;

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET || "your-fallback-secret-key-for-development",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ): Promise<User | null> {
        if (!credentials) return null;

        const { email, password } = credentials;

        try {
          // Your actual API call
          const response = await axios.post(`${BASE_URL}/api/login`, {
            email,
            password,
          });

          const user = response.data?.data?.user;

          if (user && user._id && user.email) {
            return {
              id: String(user._id),
              email: user.email,
              name: user.fullName || "User",
              role: user.role || "user",
              phoneNumber: user.phoneNumber || "",
            };
          }

          return null;
        } catch (error) {
          console.error("Login error in authorize:", error);
          // Return null instead of throwing an error
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role;
        token.phoneNumber = (user as any).phoneNumber;
        token.accessToken = `session_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        (session.user as any).role = token.role as string;
        (session.user as any).phoneNumber = token.phoneNumber as string;
      }
      (session as any).accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  debug: process.env.NODE_ENV === "development",
};