import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { ObjectId } from 'mongodb';

export const authOptions = {
  // Remove adapter - we'll handle everything manually with JWT
  debug: process.env.NODE_ENV === 'development',
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
        try {
          const client = await clientPromise;
          const db = client.db("healthCave");
          const usersCollection = db.collection("users");
          
          const user = await usersCollection.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No user found with this email");
          }
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid password");
          }
          
          return { 
            id: user._id.toString(), 
            email: user.email, 
            name: user.name,
            role: user.role || "user"
          };
        } catch (error) {
          console.error("Credentials authorization error:", error);
          throw new Error(error.message || "Authentication failed");
        }
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
    async jwt({ token, user, trigger, session, account }) {
      try {
        // Initial sign in - user object is available
        if (user) {
          console.log('[JWT] Initial sign in, user ID:', user.id);
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;
        }

        // If no token ID yet, try to get from email
        if (!token.id && token.email) {
          const client = await clientPromise;
          const db = client.db("healthCave");
          const usersCollection = db.collection("users");
          
          const dbUser = await usersCollection.findOne({ email: token.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
          }
        }

        // Only proceed if we have a token ID
        if (!token.id) {
          console.log('[JWT] No token ID, returning token as is');
          return token;
        }

        // Fetch the latest user data from the database
        const client = await clientPromise;
        const db = client.db("healthCave");
        const usersCollection = db.collection("users");
        const doctorsCollection = db.collection("doctors");

        const dbUser = await usersCollection.findOne({ _id: new ObjectId(token.id) });

        if (dbUser) {
          // Update token with latest user data
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image || token.picture;
          token.phone = dbUser.phone || null;
          token.address = dbUser.address || null;
          token.specialization = dbUser.specialization || null;
          token.bio = dbUser.bio || null;
          token.experience = dbUser.experience || null;
          token.education = dbUser.education || null;

          // Determine user role
          let userRole = dbUser.role || "user";

          const adminEmails = ['admin@healthcave.com', 'admin@example.com', 'admin@gmail.com'];

          if (adminEmails.includes(dbUser.email)) {
            userRole = 'admin';
          } else if (!dbUser.role || dbUser.role === 'user') {
            const doctorRecord = await doctorsCollection.findOne({ email: dbUser.email });
            if (doctorRecord) {
              userRole = 'doctor';
            }
          }

          token.role = userRole;

          // Update role in database if changed
          if (dbUser.role !== userRole) {
            await usersCollection.updateOne(
              { _id: new ObjectId(token.id) },
              { $set: { role: userRole, updatedAt: new Date() } }
            );
          }
        }

        return token;
      } catch (error) {
        console.error('[JWT] Error:', error);
        return token;
      }
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
        session.user.role = token.role || "user";
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
    async signIn({ user, account, profile }) {
      try {
        // Always allow credentials provider
        if (account?.provider === 'credentials') {
          return true;
        }

        // Handle OAuth providers (Google, GitHub, etc.)
        if (account && user?.email) {
          const client = await clientPromise;
          const db = client.db("healthCave");
          const usersCollection = db.collection("users");
          const doctorsCollection = db.collection("doctors");

          console.log(`[OAuth SignIn] Provider: ${account.provider}, Email: ${user.email}`);

          // Check if user exists
          let existingUser = await usersCollection.findOne({ email: user.email });

          if (!existingUser) {
            console.log('[OAuth SignIn] Creating new user');
            
            // Determine role for new user
            let userRole = "user";
            const adminEmails = ['admin@healthcave.com', 'admin@example.com', 'admin@gmail.com'];
            
            if (adminEmails.includes(user.email)) {
              userRole = 'admin';
            } else {
              const doctorRecord = await doctorsCollection.findOne({ email: user.email });
              if (doctorRecord) {
                userRole = 'doctor';
              }
            }

            // Create new user
            const newUser = {
              name: user.name,
              email: user.email,
              image: user.image,
              role: userRole,
              emailVerified: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
              oauthProviders: [account.provider]
            };

            const result = await usersCollection.insertOne(newUser);
            user.id = result.insertedId.toString();
            console.log('[OAuth SignIn] New user created with ID:', user.id);
          } else {
            console.log('[OAuth SignIn] Existing user found');
            user.id = existingUser._id.toString();
            
            // Update OAuth providers list if needed
            if (!existingUser.oauthProviders || !existingUser.oauthProviders.includes(account.provider)) {
              await usersCollection.updateOne(
                { _id: existingUser._id },
                { 
                  $addToSet: { oauthProviders: account.provider },
                  $set: { updatedAt: new Date() }
                }
              );
            }
          }

          return true;
        }

        return true;
      } catch (error) {
        console.error('[OAuth SignIn] Error:', error);
        // Always return true to prevent blocking users
        return true;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
