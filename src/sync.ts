import "dotenv/config";

import { getCustomersChangesStream } from "./db";
import { anonymiseCustomer, anonymisePartialCustomer } from "./anonymiser";
import { CustomerAnonymisedWriter } from "./db/writes/customerAnonymised/writer";

const writer = new CustomerAnonymisedWriter();
async function run() {
  const changeStream = getCustomersChangesStream();
  for await (const change of changeStream) {
    if (change.operationType === "insert") {
      change.change = {
        _id: change.change._id,
        ...anonymiseCustomer(change.change),
      };
    }

    if (change.operationType === "update") {
      change.change = {
        _id: change.change._id,
        removeFields: change.change.removeFields,
        updateFields: change.change.updateFields
          ? anonymisePartialCustomer(change.change.updateFields)
          : undefined,
      };
    }

    await writer.write(change);
  }
}

run().then(() => {
  console.log("Done!");
});
