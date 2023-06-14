import { SyncMode } from "../../types/syncMode";
import { getCustomerEventsStream } from "./events";
import { getCustomerCollectionStream } from "./collectionStream";

export * from "./types";

export function getCustomerStream(
  mode: SyncMode,
  resumeToken: unknown | undefined
) {
  if (mode === SyncMode.Watch) {
    return getCustomerEventsStream(resumeToken);
  }

  return getCustomerCollectionStream();
}
