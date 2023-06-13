import { MongoClient } from "mongodb";
import { Customer } from "../types/customer";

const mongoUri = process.env.DB_URI;
if (!mongoUri) {
  throw new Error("DB_URI is not defined");
}

const mongoClient = new MongoClient(mongoUri);

export const db = mongoClient.db("obfuscation");
export const customersCollection = db.collection<Customer>("customers");
export const customersAnonymisedCollection = db.collection<Customer>(
  "customers_anonymised"
);

export { getCustomersChangesStream } from "./changes";
