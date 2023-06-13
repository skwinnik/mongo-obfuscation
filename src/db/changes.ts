import { customersCollection } from "./index";

export async function* getCustomersChangesStream() {
  const changeStream = customersCollection.watch();
  for await (const change of changeStream) {
    yield change;
  }

  customersCollection.find();
}
