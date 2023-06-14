import "dotenv/config";
import { generateCustomers } from "./customer/generator";
import { customersCollection } from "./db";

async function run() {
  const generator = generateCustomers();
  for await (const customers of generator) {
    await customersCollection.insertMany(customers);
    console.log("Inserted customers: ", customers.length);
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
