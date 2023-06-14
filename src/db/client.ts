import { MongoClient } from "mongodb";

const mongoUri = process.env.DB_URI;
if (!mongoUri) {
  throw new Error("DB_URI is not defined");
}
const mongoClient = new MongoClient(mongoUri);

export const db = mongoClient.db("obfuscation");
