import { Customer } from "../types/customer";
import { ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";
import { waitForDelay } from "../utils/waitForDelay";

function createRandomCustomer(): Customer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    address: {
      line1: faker.location.streetAddress(),
      line2: faker.location.secondaryAddress(),
      postcode: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
    },
    createdAt: faker.date.past(),
  };
}

/// This is a generator function. It will yield a new
/// array of customers every 200ms.
export async function* generateCustomers() {
  while (true) {
    yield faker.helpers.multiple(createRandomCustomer, {
      count: {
        min: 1,
        max: 10,
      },
    });
    await waitForDelay(200);
  }
}
