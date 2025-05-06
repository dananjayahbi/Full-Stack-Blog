import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "@/lib/db";

// Default admin credentials
const DEFAULT_ADMIN = {
  id: "default-admin-id",
  email: "admin@example.com",
  name: "Admin User",
  role: "admin",
};
const DEFAULT_ADMIN_PASSWORD = "admin123";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if the default admin credentials are being used
        if (
          credentials.email === DEFAULT_ADMIN.email &&
          credentials.password === DEFAULT_ADMIN_PASSWORD
        ) {
          console.log("Default admin login successful");
          return DEFAULT_ADMIN;
        }

        try {
          // Try to find the user in the database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error("Database authentication error:", error);

          // If database authentication fails but it's the default admin email,
          // fall back to the hard-coded admin credentials
          if (
            credentials.email === DEFAULT_ADMIN.email &&
            credentials.password === DEFAULT_ADMIN_PASSWORD
          ) {
            console.log("Fallback to default admin login successful");
            return DEFAULT_ADMIN;
          }

          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };