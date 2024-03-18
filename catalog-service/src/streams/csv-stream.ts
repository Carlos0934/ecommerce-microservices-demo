export class CsvStream implements Transformer<Uint8Array, string> {
  private headerLine: boolean = true;
  private keys: string[] = [];
  private tailChunk: string = "";
  private decoder: TextDecoder = new TextDecoder("utf-8");

  transform(
    chunk: Uint8Array,
    controller: TransformStreamDefaultController<string>
  ) {
    const stringChunks = this.decoder.decode(chunk, { stream: true });
    const lines = stringChunks.split("\n");

    for (const line of lines) {
      const lineString = this.tailChunk + line;

      const values = lineString.split(",");

      if (this.headerLine) {
        this.keys = values;
        this.headerLine = false;
        continue;
      }

      if (
        values.length !== this.keys.length ||
        lineString[lineString.length - 1] === ","
      ) {
        this.tailChunk = line;
      } else {
        const chunkObject: { [key: string]: string } = {};

        this.keys.forEach((element, index) => {
          chunkObject[element] = values[index];
        });

        this.tailChunk = "";

        controller.enqueue(`${JSON.stringify(chunkObject)}`);
      }
    }
  }

  start() {
    this.decoder = new TextDecoder("utf-8");
  }
}
