import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import connectToDatabase from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          // Connect to database with error handling
          try {
            await connectToDatabase();
          } catch (error) {
            console.error("Database connection error during login:", error);
            throw new Error("Database connection failed. Please try again later.");
          }
          
          // Find user with error handling
          let user;
          try {
            user = await User.findOne({ email: credentials.email });
          } catch (error) {
            console.error("Error finding user:", error);
            throw new Error("Authentication service error. Please try again later.");
          }
          
          if (!user) {
            throw new Error("No user found with this email");
          }
          
          // Compare password with error handling
          let isPasswordValid;
          try {
            isPasswordValid = await compare(credentials.password, user.password);
          } catch (error) {
            console.error("Password comparison error:", error);
            throw new Error("Authentication failed. Please try again.");
          }
          
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }
          
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // When deploying to production, set the NEXTAUTH_URL environment variable to the canonical URL of your site
  // For Vercel deployments, this is handled automatically
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST }; 