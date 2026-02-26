import mongoose from "mongoose";

import 'dotenv/config';

const uri = process.env.MONGODB_URI || "mongodb+srv://pindari:pindari@cluster0.awhfz42.mongodb.net/?appName=Cluster0";

let connecting: Promise<typeof mongoose> | null = null;

export async function connectMongoose() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connecting) connecting = mongoose.connect(uri, { autoIndex: true });
  await connecting;
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
