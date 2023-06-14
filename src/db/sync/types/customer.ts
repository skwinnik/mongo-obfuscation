import { Customer, PartialCustomerFlat } from "../../../types/customer";
import { ObjectId } from "mongodb";

type DocumentId = { _id: ObjectId };

export type InsertCustomerDocument = DocumentId & Customer;
export type UpdateCustomerDocument = DocumentId & {
  updateFields: PartialCustomerFlat | undefined;
  removeFields: Array<keyof PartialCustomerFlat> | undefined;
};
export type ReplaceCustomerDocument = DocumentId & Customer;

export type CommonCustomerEvent = {
  resumeToken?: unknown;
};

export type InsertCustomerEvent = {
  operationType: "insert";
  document: InsertCustomerDocument;
} & CommonCustomerEvent;
export type UpdateCustomerEvent = {
  operationType: "update";
  document: UpdateCustomerDocument;
} & CommonCustomerEvent;

export type ReplaceCustomerEvent = {
  operationType: "replace";
  document: ReplaceCustomerDocument;
} & CommonCustomerEvent;

export type CustomerChange =
  | InsertCustomerEvent
  | UpdateCustomerEvent
  | ReplaceCustomerEvent;
