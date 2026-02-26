import 'dotenv/config';
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectMongoose, getMongoClient } from "../../../../lib/mongodb";

// Build providers array conditionally so missing env vars don't break startup
const providers: any[] = [];
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(GitHubProvider({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }));
} else {
  console.warn("GITHUB_ID / GITHUB_SECRET not set — GitHub provider disabled : ", process.env.GITHUB_ID, process.env.GITHUB_SECRET);
}

if (process.env.SMTP_URL || process.env.SMTP_TRANSPORT) {
  providers.push(EmailProvider({ server: process.env.SMTP_URL || process.env.SMTP_TRANSPORT, from: process.env.EMAIL_FROM }));
} else {
  console.warn("SMTP not configured — Email provider disabled");
}

let adapter: any = undefined;
try {
  if (process.env.MONGODB_URI) {
    // attempt mongoose connection; if it fails we'll continue without adapter
    await connectMongoose();
    const client = await getMongoClient();
    adapter = MongoDBAdapter(client as any);
  } else {
    console.warn("MONGODB_URI not set — NextAuth adapter disabled");
  }
} catch (err) {
  console.warn("Could not connect to MongoDB — NextAuth adapter disabled", err);
}

export const authOptions = {
  providers,
  adapter,
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
