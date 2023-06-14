import "dotenv/config";

import { getCustomerStream } from "./customer/events";
import { loadResumeToken } from "./resumeToken";

import { anonymisedWriter } from "./customer/anonymisedWriter";
import { SyncMode } from "./types/syncMode";

let MODE: SyncMode = SyncMode.Watch;

async function run() {
  let resumeToken: unknown | undefined = undefined;

  if (MODE === SyncMode.Watch) {
    resumeToken = await loadResumeToken("customers_anonymised");
    console.log("sync: resuming changes stream, resumeToken: ", resumeToken);
  }

  const customersStream = getCustomerStream(MODE, resumeToken);

  for await (const customerUpdate of customersStream) {
    await anonymisedWriter.push(customerUpdate);
  }

  console.log("sync: stream ended, flushing changes");
  await anonymisedWriter.flush();
}

if (process.argv.length > 2 && process.argv[2] === "--full-reindex") {
  MODE = SyncMode.FullReindex;
  console.log("sync: full reindex mode");
}

run().then(
  () => {
    console.log("Done!");
    process.exit(0);
  },
  (err) => {
    console.log(err.message);
    process.exit(1);
  }
);
