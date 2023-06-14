import { CustomerChange } from "./types/customer";
import { AnyBulkWriteOperation } from "mongodb";
import { Customer } from "../../types/customer";
import { tr } from "@faker-js/faker";

export function prepareCustomerChangesWrites(
  changes: CustomerChange[]
): AnyBulkWriteOperation<Customer>[] {
  const operations: AnyBulkWriteOperation<Customer>[] = [];

  for (const change of changes) {
    switch (change.operationType) {
      case "insert":
        operations.push({
          insertOne: {
            document: change.document,
          },
        });
        break;

      case "update":
        operations.push({
          updateOne: {
            filter: { _id: change.document._id },
            update: {
              $set: change.document.updateFields || {},
              $unset:
                change.document.removeFields?.reduce((acc, field) => {
                  acc[field] = true;
                  return acc;
                }, {} as Record<string, true>) || {},
            },
            upsert: true,
          },
        });
        break;

      case "replace":
        operations.push({
          replaceOne: {
            filter: { _id: change.document._id },
            replacement: change.document,
            upsert: true,
          },
        });
        break;
    }
  }

  return operations;
}
