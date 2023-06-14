import {
  CustomerChange,
  InsertCustomerEvent,
  InsertCustomerDocument,
  UpdateCustomerEvent,
  UpdateCustomerDocument,
} from "../types/customer";
import { customersCollection } from "../../collections";
import { Customer, PartialCustomerFlat } from "../../../types/customer";
import {
  ChangeStreamInsertDocument,
  ChangeStreamUpdateDocument,
} from "mongodb";

export async function* getCustomersChangesStream(
  resumeToken: unknown | undefined
): AsyncGenerator<CustomerChange> {
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
      yield getInsertCustomerChange(change);
      continue;
    }

    if (change.operationType === "update") {
      yield getUpdateCustomerChange(change);
      continue;
    }
  }
}

function getUpdateCustomerChange(
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

function getInsertCustomerChange(
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
