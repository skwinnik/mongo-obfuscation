import { getCustomersChangesStream } from "./changes";
import { getCustomersFullStream } from "./full";

export function getCustomersStreamGenerator(
  resume: boolean,
  resumeToken: unknown | undefined
) {
  if (resume) {
    return getCustomersChangesStream(resumeToken);
  }

  return getCustomersFullStream();
}
