import { CustomerChange } from "../types/customer";
import { customersCollection } from "../../collections";

export async function* getCustomersFullStream(): AsyncGenerator<CustomerChange> {
  const customersStream = customersCollection.find();

  for await (const customer of customersStream) {
    yield {
      operationType: "replace",
      document: customer,
    };
  }
}
