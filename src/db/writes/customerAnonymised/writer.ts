import { CustomerChange } from "../../changes/types/customer";
import { customersAnonymisedCollection } from "../../collections";
import { Customer, PartialCustomerFlat } from "../../../types/customer";

export class CustomerAnonymisedWriter {
  private buffer: CustomerChange[] = [];
  private timeout: NodeJS.Timeout | undefined = undefined;

  async write(change: CustomerChange) {
    this.buffer.push(change);
    if (this.buffer.length >= 1000) {
      console.log(
        "CustomerAnonymisedWriter: limit exceeded, flushing changes: ",
        this.buffer.length
      );
      await this.flushChanges();
      return;
    }

    if (!this.timeout)
      this.timeout = setTimeout(async () => {
        console.log(
          "CustomerAnonymisedWriter: timeout exceeded, flushing changes: ",
          this.buffer.length
        );
        await this.flushChanges();
      }, 1000);
  }

  private async flushChanges() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }

    if (this.buffer.length === 0) return;

    //write
    await customersAnonymisedCollection.bulkWrite(
      this.buffer.map((change) => {
        if (change.operationType === "insert") {
          return {
            insertOne: {
              document: change.change,
            },
          };
        }

        return {
          updateOne: {
            filter: { _id: change.change._id },
            update: {
              $set: change.change.updateFields || {},
              $unset:
                change.change.removeFields?.reduce((acc, field) => {
                  acc[field] = true;
                  return acc;
                }, {} as Record<string, true>) || {},
            },
          },
        };
      })
    );

    //clear buffer
    this.buffer.length = 0;
  }
}
