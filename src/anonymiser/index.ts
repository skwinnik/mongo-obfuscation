import * as crypto from "crypto";
import { Customer, PartialCustomerFlat } from "../types/customer";
import { CustomerEvent } from "../customer/events";
import { faker } from "@faker-js/faker";

export function anonymiseCustomerEvent(event: CustomerEvent): CustomerEvent {
  if (event.operationType === "insert" || event.operationType === "replace") {
    event.document = {
      _id: event.document._id,
      ...anonymiseCustomer(event.document),
    };
  }

  if (event.operationType === "update") {
    event.document = {
      _id: event.document._id,
      removeFields: event.document.removeFields,
      updateFields: event.document.updateFields
        ? anonymisePartialCustomer(event.document.updateFields)
        : undefined,
    };
  }

  return event;
}

function anonymiseCustomer(customer: Customer): Customer {
  return {
    ...customer,
    firstName: generateHash(customer.firstName),
    lastName: generateHash(customer.lastName),
    email: generateHash(customer.email) + `@${customer.email.split("@")[1]}`,
    address: {
      ...customer.address,
      line1: generateHash(customer.address.line1),
      line2: generateHash(customer.address.line2),
      postcode: generateHash(customer.address.postcode),
    },
  };
}

function anonymisePartialCustomer(
  partialCustomer: PartialCustomerFlat
): PartialCustomerFlat {
  const anonymisedCustomer = { ...partialCustomer };
  if (partialCustomer.firstName) {
    anonymisedCustomer.firstName = generateHash(partialCustomer.firstName);
  }
  if (partialCustomer.lastName) {
    anonymisedCustomer.lastName = generateHash(partialCustomer.lastName);
  }

  if (partialCustomer.email) {
    anonymisedCustomer.email =
      generateHash(partialCustomer.email) +
      `@${partialCustomer.email.split("@")[1]}`;
  }

  if (partialCustomer["address.line1"]) {
    anonymisedCustomer["address.line1"] = generateHash(
      partialCustomer["address.line1"]
    );
  }

  if (partialCustomer["address.line2"]) {
    anonymisedCustomer["address.line2"] = generateHash(
      partialCustomer["address.line2"]
    );
  }

  if (partialCustomer["address.postcode"]) {
    anonymisedCustomer["address.postcode"] = generateHash(
      partialCustomer["address.postcode"]
    );
  }

  return anonymisedCustomer;
}

function generateHash(name: string) {
  const hash = crypto.createHash("sha1");
  hash.update(name);

  // I could have used a base62 encoding lib here, but I didn't want to add a new dependency
  return hash
    .digest("base64")
    .replace(/[\+\/]/g, "0")
    .slice(0, 8);
}
