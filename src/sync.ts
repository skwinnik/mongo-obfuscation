import "dotenv/config";

import { getCustomersChangesStream } from "./db";

async function run() {
  const changeStream = getCustomersChangesStream();
  for await (const change of changeStream) {
    console.log(change);
  }
}

run().then(() => {
  console.log("Done!");
});
