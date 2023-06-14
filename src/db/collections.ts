import { Customer } from "../types/customer";
import { db } from "./index";

export const customersCollection = db.collection<Customer>("customers");
export const customersAnonymisedCollection = db.collection<Customer>(
  "customers_anonymised"
);
