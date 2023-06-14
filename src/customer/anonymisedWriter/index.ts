import { customersAnonymisedCollection, WriteBuffer } from "../../db";
import { CustomerEvent } from "../events";
import { transaction } from "../../db/transaction";
import { anonymiseCustomerEvent } from "../../anonymiser";
import { customerEventToBulkWriteOperation } from "./customerEventToBulkWriteOperation";
import { saveResumeToken } from "../../resumeToken";

export const anonymisedWriter: WriteBuffer<CustomerEvent> =
  new WriteBuffer<CustomerEvent>(async (events) => {
    await transaction(async () => {
      if (events.length === 0) return;
      const resumeToken = events[events.length - 1].resumeToken;
      const writeOperations = events
        .map((event) => anonymiseCustomerEvent(event))
        .map((event) => customerEventToBulkWriteOperation(event));

      await customersAnonymisedCollection.bulkWrite(writeOperations);

      if (resumeToken !== undefined)
        await saveResumeToken("customers_anonymised", resumeToken);
    });
  });
