import { Customer, PartialCustomer } from "../../../types/customer";
import { ObjectId } from "mongodb";

type DocumentId = { _id: ObjectId };

export type InsertCustomerDocument = DocumentId & Customer;
export type UpdateCustomerDocument = DocumentId &
  PartialCustomer & {
    removeFields: string[] | undefined;
  };

export type InsertCustomerChange = {
  operationType: "insert";
  change: InsertCustomerDocument;
};
export type UpdateCustomerChange = {
  operationType: "update";
  change: UpdateCustomerDocument;
};

export type CustomerChange = InsertCustomerChange | UpdateCustomerChange;
