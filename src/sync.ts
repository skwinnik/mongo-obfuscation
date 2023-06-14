import "dotenv/config";

import { customersAnonymisedCollection } from "./db";
import { anonymiseCustomerChange } from "./anonymiser";
import { CustomerChange } from "./db/sync/types/customer";
import { prepareCustomerChangesWrites } from "./db/sync/bulkOperations";
import { transaction } from "./db/transaction";
import { loadResumeToken, saveResumeToken } from "./db/sync/resumeToken";
import { getCustomersStreamGenerator } from "./db/sync";

const MODE: "watch" | "reindex" = "watch";
let timeout: NodeJS.Timeout | undefined = undefined;
async function run() {
  let buffer: CustomerChange[] = [];
  let resumeToken: unknown | undefined = undefined;

  if (MODE === "watch") {
    resumeToken = await loadResumeToken("customers_anonymised");
    console.log("resumeToken: ", resumeToken);
  }

  const customersStream = getCustomersStreamGenerator(
    MODE === "watch",
    resumeToken
  );

  for await (const customerUpdate of customersStream) {
    const anonymisedUpdate = anonymiseCustomerChange(customerUpdate);

    buffer.push(anonymisedUpdate);
    if (buffer.length >= 1000) {
      console.log("sync: limit exceeded, flushing changes: ", buffer.length);
      await writeBuffer(buffer);
      buffer = [];
      continue;
    }

    if (!timeout)
      timeout = setTimeout(async () => {
        console.log(
          "sync: timeout exceeded, flushing changes: ",
          buffer.length
        );
        await writeBuffer(buffer);
        buffer = [];
      }, 1000);
  }
}

async function writeBuffer(buffer: CustomerChange[]) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = undefined;
  }

  if (buffer.length === 0) return;
  const writeOperations = prepareCustomerChangesWrites(buffer);

  await transaction(async () => {
    await customersAnonymisedCollection.bulkWrite(writeOperations);
    await saveResumeToken(
      "customers_anonymised",
      buffer[buffer.length - 1].resumeToken
    );
  });
}

run().then(
  () => {
    console.log("Done!");
  },
  (err) => {
    console.log(err.message);
  }
);
