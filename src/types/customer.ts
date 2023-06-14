export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  address: CustomerAddress;
  createdAt: Date;
};

export type CustomerAddress = {
  line1: string;
  line2: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
};

export type PartialCustomerFlat = Partial<Customer> & {
  "address.line1": Partial<CustomerAddress>["line1"];
  "address.line2": Partial<CustomerAddress>["line2"];
  "address.postcode": Partial<CustomerAddress>["postcode"];
  "address.city": Partial<CustomerAddress>["city"];
  "address.state": Partial<CustomerAddress>["state"];
  "address.country": Partial<CustomerAddress>["country"];
};
