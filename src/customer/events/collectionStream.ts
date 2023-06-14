import { CustomerEvent } from ".";
import { customersCollection } from "../../db/collections";

export async function* getCustomerCollectionStream(): AsyncGenerator<CustomerEvent> {
  const customerCursor = customersCollection.find();

  for await (const customer of customerCursor) {
    yield {
      operationType: "replace",
      document: customer,
    };
  }
}
