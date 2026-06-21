import mongoose from "mongoose";

import 'dotenv/config';

const uri = process.env.MONGODB_URI || "mongodb+srv://pindari:pindari@cluster0.awhfz42.mongodb.net/?appName=Cluster0";

let connecting: Promise<typeof mongoose> | null = null;

export async function connectMongoose() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connecting) {
    // Fail fast (5s) so callers can fall back to local storage instead of hanging.
    connecting = mongoose.connect(uri, { autoIndex: true, serverSelectionTimeoutMS: 5000 });
  }
  try {
    await connecting;
  } catch (err) {
    // Reset so a later call can retry rather than re-throwing a stale rejection.
    connecting = null;
    throw err;
  }
  return mongoose;
}

// Return the native MongoClient instance (used by next-auth adapter)
export async function getMongoClient() {
  await connectMongoose();
  // mongoose.connection.getClient() exists and returns the underlying MongoClient
  // @ts-ignore
  return (mongoose.connection as any).getClient();
}

export async function getDb() {
  await connectMongoose();
  return mongoose.connection.db;
}
