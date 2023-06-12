import "dotenv/config";
import { generateCustomers } from "./generator";
import { customersCollection } from "./db";

async function run() {
  const generator = generateCustomers();
  for await (const customers of generator) {
    console.log("Inserting customers: ", customers.length);
    await customersCollection.insertMany(customers);
  }
}

console.log("Generating data...");
run().then(
  () => {
    console.log("Done!");
  },
  (err) => {
    console.error(err);
  }
);
