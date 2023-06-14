import { mongoClient } from "./client";

export async function transaction(cb: () => Promise<void>) {
  const session = mongoClient.startSession();
  session.startTransaction();

  try {
    await cb();
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
}
