import * as crypto from "crypto";
import { Customer, PartialCustomer } from "../../types/customer";

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
  partialCustomer: PartialCustomer
): PartialCustomer {
  return {
    ...partialCustomer,
    firstName: generateHashSafe(partialCustomer.firstName),
    lastName: generateHashSafe(partialCustomer.lastName),
    email:
      partialCustomer.email !== undefined
        ? generateHashSafe(partialCustomer.email) +
          `@${partialCustomer.email.split("@")[1]}`
        : undefined,

    address: {
      ...partialCustomer.address,
      line1: generateHashSafe(partialCustomer.address?.line1),
      line2: generateHashSafe(partialCustomer.address?.line2),
      postcode: generateHashSafe(partialCustomer.address?.postcode),
    },
  };
}

function generateHash(name: string) {
  const hash = crypto.createHash("sha1");
  hash.update(name);
  return hash.digest("base64").slice(0, 8);
}

function generateHashSafe(name?: string) {
  if (!name) return undefined;
  return generateHash(name);
}
