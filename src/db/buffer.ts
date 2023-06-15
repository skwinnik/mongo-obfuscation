export class WriteBuffer<T> {
  private buffer: T[] = [];
  private bufferMaxSize = 1000;
  private bufferTimeout = 1000;
  private bufferTimeoutId: NodeJS.Timeout | null = null;

  constructor(private writeCb: (documents: T[]) => Promise<void>) {}

  public async push(document: T): Promise<void> {
    this.buffer.push(document);

    if (this.buffer.length >= this.bufferMaxSize) {
      console.log(
        "buffer: buffer size exceeded, flushing changes: ",
        this.buffer.length
      );
      await this.flush();
      return;
    }

    if (!this.bufferTimeoutId) {
      this.bufferTimeoutId = setTimeout(() => {
        console.log(
          "buffer: timeout exceeded, flushing changes: ",
          this.buffer.length
        );
        this.flush();
      }, this.bufferTimeout);
    }
  }

  public async close() {
    console.log(
      "buffer: writer closed, flushing changes: ",
      this.buffer.length
    );
    await this.flush();
  }

  private async flush(): Promise<void> {
    if (this.bufferTimeoutId) {
      clearTimeout(this.bufferTimeoutId);
      this.bufferTimeoutId = null;
    }

    const changesToWrite = this.buffer.splice(0, this.buffer.length);
    await this.writeCb(changesToWrite);
  }
}
