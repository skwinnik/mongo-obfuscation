import "dotenv/config";

import { getCustomersChangesStream } from "./db";
import { anonymiseCustomer, anonymisePartialCustomer } from "./anonymiser";

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
        ...anonymisePartialCustomer(change.change),
      };
    }

    console.log(change);
  }
}

run().then(() => {
  console.log("Done!");
});
