import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { ObjectId } from 'mongodb';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  allowDangerousEmailAccountLinking: true,
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const usersCollection = client.db().collection("users");
        const user = await usersCollection.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const client = await clientPromise;
      const db = client.db("healthCave");
      const usersCollection = db.collection("users");

      if (user) {
        token.id = user.id;
        // Ensure emailVerified is set for OAuth users if it's null
        if (user.emailVerified === null || user.emailVerified === undefined) {
          token.emailVerified = new Date();
        } else {
          token.emailVerified = user.emailVerified;
        }
      }

      // Fetch the latest user data from the database
      const dbUser = await usersCollection.findOne({ _id: new ObjectId(token.id) });

      if (dbUser) {
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.phone = dbUser.phone || null;
        token.address = dbUser.address || null;
        token.specialization = dbUser.specialization || null;
        token.bio = dbUser.bio || null;
        token.experience = dbUser.experience || null;
        token.education = dbUser.education || null;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.phone = token.phone;
        session.user.address = token.address;
        session.user.specialization = token.specialization;
        session.user.bio = token.bio;
        session.user.experience = token.experience;
        session.user.education = token.education;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        const target = new URL(url, baseUrl);
        if (target.origin === baseUrl) return target.href;
      } catch {}
      if (url?.startsWith("/")) return `${baseUrl}${url}`;
      // Default to dashboard if external or invalid
      return `${baseUrl}/dashboard`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
