import { Customer, PartialCustomer } from "../../../types/customer";
import { ObjectId } from "mongodb";

type DocumentId = { _id: ObjectId };

export type InsertCustomerChange = DocumentId & Customer;
export type UpdateCustomerChange = DocumentId &
  PartialCustomer & {
    removeFields: string[] | undefined;
  };
export type CustomerChange =
  | {
      operationType: "insert";
      change: InsertCustomerChange;
    }
  | {
      operationType: "update";
      change: UpdateCustomerChange;
    };
