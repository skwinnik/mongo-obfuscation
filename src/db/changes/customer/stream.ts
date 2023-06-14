import {
  CustomerChange,
  InsertCustomerChange,
  InsertCustomerDocument,
  UpdateCustomerChange,
  UpdateCustomerDocument,
} from "../types/customer";
import { customersCollection } from "../../collections";
import { Customer, PartialCustomerFlat } from "../../../types/customer";
import {
  ChangeStreamInsertDocument,
  ChangeStreamUpdateDocument,
} from "mongodb";

export async function* getCustomersChangesStream(): AsyncGenerator<CustomerChange> {
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
    {}
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
): UpdateCustomerChange {
  return {
    operationType: "update",
    change: {
      _id: change.documentKey._id,
      updateFields: change.updateDescription.updatedFields,
      removeFields: change.updateDescription.removedFields,
    } as UpdateCustomerDocument,
  };
}

function getInsertCustomerChange(
  change: ChangeStreamInsertDocument<Customer>
): InsertCustomerChange {
  return {
    operationType: "insert",
    change: {
      _id: change.documentKey._id,
      ...change.fullDocument,
    } as InsertCustomerDocument,
  };
}
