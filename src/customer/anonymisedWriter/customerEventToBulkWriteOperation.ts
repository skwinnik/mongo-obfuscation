import {
  CustomerEvent,
  InsertCustomerEvent,
  ReplaceCustomerEvent,
  UpdateCustomerEvent,
} from "../events";
import { AnyBulkWriteOperation } from "mongodb";
import { Customer } from "../../types/customer";

export function customerEventToBulkWriteOperation(
  event: CustomerEvent
): AnyBulkWriteOperation<Customer> {
  switch (event.operationType) {
    case "replace":
    case "insert":
      return getReplaceWriteOperation(event);
    case "update":
      return getUpdateWriteOperation(event);
  }
}

function getReplaceWriteOperation(
  event: ReplaceCustomerEvent | InsertCustomerEvent
): AnyBulkWriteOperation<Customer> {
  return {
    replaceOne: {
      filter: { _id: event.document._id },
      replacement: event.document,
      upsert: true,
    },
  };
}

function getUpdateWriteOperation(
  event: UpdateCustomerEvent
): AnyBulkWriteOperation<Customer> {
  return {
    updateOne: {
      filter: { _id: event.document._id },
      update: {
        $set: event.document.updateFields || {},
        $unset:
          event.document.removeFields?.reduce((acc, field) => {
            acc[field] = true;
            return acc;
          }, {} as Record<string, true>) || {},
      },
      upsert: true,
    },
  };
}
