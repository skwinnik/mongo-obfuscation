import {
  CustomerEvent,
  InsertCustomerEvent,
  InsertCustomerDocument,
  UpdateCustomerEvent,
  UpdateCustomerDocument,
} from ".";
import { customersCollection } from "../../db/collections";
import { Customer, PartialCustomerFlat } from "../../types/customer";
import {
  ChangeStreamInsertDocument,
  ChangeStreamUpdateDocument,
} from "mongodb";

export async function* getCustomerEventsStream(
  resumeToken: unknown | undefined
): AsyncGenerator<CustomerEvent> {
  const changeStream = customersCollection.watch<
    Customer,
    | ChangeStreamInsertDocument<Customer>
    | ChangeStreamUpdateDocument<PartialCustomerFlat>
  >(
    [
      {
        $match: {
          $or: [{ operationType: "insert" }, { operationType: "update" }],
        },
      },
    ],
    {
      resumeAfter: resumeToken,
    }
  );

  for await (const change of changeStream) {
    if (change.operationType === "insert") {
      yield getInsertCustomerEvent(change);
      continue;
    }

    if (change.operationType === "update") {
      yield getUpdateCustomerEvent(change);
      continue;
    }
  }
}

function getUpdateCustomerEvent(
  change: ChangeStreamUpdateDocument<PartialCustomerFlat>
): UpdateCustomerEvent {
  return {
    resumeToken: change._id,
    operationType: "update",
    document: {
      _id: change.documentKey._id,
      updateFields: change.updateDescription.updatedFields,
      removeFields: change.updateDescription.removedFields,
    } as UpdateCustomerDocument,
  };
}

function getInsertCustomerEvent(
  change: ChangeStreamInsertDocument<Customer>
): InsertCustomerEvent {
  return {
    resumeToken: change._id,
    operationType: "insert",
    document: {
      _id: change.documentKey._id,
      ...change.fullDocument,
    } as InsertCustomerDocument,
  };
}
