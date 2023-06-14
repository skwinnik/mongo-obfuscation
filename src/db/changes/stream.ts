import {
  CustomerChange,
  InsertCustomerChange,
  InsertCustomerDocument,
  UpdateCustomerChange,
  UpdateCustomerDocument,
} from "./types/customer";
import { customersCollection } from "../collections";
import { Customer } from "../../types/customer";
import {
  ChangeStreamInsertDocument,
  ChangeStreamUpdateDocument,
} from "mongodb";

export async function* getCustomersChangesStream(): AsyncGenerator<CustomerChange> {
  const changeStream = customersCollection.watch<
    Customer,
    | ChangeStreamInsertDocument<Customer>
    | ChangeStreamUpdateDocument<Record<string, string>>
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
  change: ChangeStreamUpdateDocument<Record<string, string>>
): UpdateCustomerChange {
  return {
    operationType: "update",
    change: {
      _id: change.documentKey._id,
      firstName: change.updateDescription.updatedFields?.["firstName"],
      lastName: change.updateDescription.updatedFields?.["lastName"],
      email: change.updateDescription.updatedFields?.["email"],
      createdAt: change.updateDescription.updatedFields?.["createdAt"]
        ? new Date(change.updateDescription.updatedFields?.["createdAt"])
        : undefined,
      address: {
        line1: change.updateDescription.updatedFields?.["address.line1"],
        line2: change.updateDescription.updatedFields?.["address.line2"],
        postcode: change.updateDescription.updatedFields?.["address.postcode"],
        city: change.updateDescription.updatedFields?.["address.city"],
        state: change.updateDescription.updatedFields?.["address.state"],
        country: change.updateDescription.updatedFields?.["address.country"],
      },
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
