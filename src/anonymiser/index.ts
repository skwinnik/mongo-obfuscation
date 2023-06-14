import * as crypto from "crypto";
import { Customer, PartialCustomerFlat } from "../types/customer";

export function anonymiseCustomer(customer: Customer): Customer {
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

export function anonymisePartialCustomer(
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
  return hash.digest("base64").slice(0, 8);
}
