import axios from  "axios";
import {AuthOptions, User} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api"

export const authOptions: AuthOptions = {
    session:{
        strategy: "jwt",
    },
    secret:process.env.AuthSecret,
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
            console.log("🛂 Received credentials:", email, password);
            try {
              const response = await axios.post(
                `${BASE_URL}/api/login`,
                { email, password }
              );

              console.log("🔐 Backend login response:", response.data);
    
              const user = response.data?.data?.user;
              const userToken = response.data?.data?.token;

              // localStorage.setItem("session-token", userToken);
    
              if (user && user._id && user.email && userToken && user.role && user.phoneNumber) {
                return {
                  id: String(user._id),
                  email: user.email,
                  name: user.fullName || "User",
                  role: user.role,
                  phoneNumber: user.phoneNumber,
                  accessToken: userToken, // add this line
                };
              }
    
              return null;
            } catch (error) {
              console.error(error,"Login error in authorize:");
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
            token.fullName = user.name;
            token.role = user.role;
            token.phoneNumber = user.phoneNumber;
            token.accessToken = (user as any).accessToken; 
          }
          return token;
        },
        async session({ session, token }) {
            if (session.user) {
              session.user.id = token.id as string;
              session.user.name = token.name as string;
              session.user.email = token.email as string;   
              session.user.role = token.role as string;
              session.user.phoneNumber = token.phoneNumber as string;
            }
            (session as any).accessToken = token.accessToken;

            return session;
          },
          
      },
}