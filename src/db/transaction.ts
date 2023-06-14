import { mongoClient } from "./client";

export async function transaction(cb: () => void) {
  const session = mongoClient.startSession();
  session.startTransaction();

  try {
    cb();
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
}
