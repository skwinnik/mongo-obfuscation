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

export type PartialCustomer = Omit<Partial<Customer>, "address"> & {
  address: Partial<CustomerAddress>;
};
