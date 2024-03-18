import { ZipReaderStream } from "https://deno.land/x/zipjs@v2.7.40/index.js";
import { Product } from "../domain/item.ts";
import { ProductLoader } from "../domain/product-loader.ts";
import { CsvStream } from "../streams/csv-stream.ts";
import { ItemTransformer } from "../streams/item-stream.ts";

const AMAZON_PRODUCTS_ZIP_URL =
  "https://storage.googleapis.com/kaggle-data-sets/3798081/7643327/compressed/amazon_products.csv.zip?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcp-kaggle-com%40kaggle-161607.iam.gserviceaccount.com%2F20240317%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240317T022602Z&X-Goog-Expires=259200&X-Goog-SignedHeaders=host&X-Goog-Signature=0d7474c475764d42564e1f03c51ef5c78fa6b178222cb51d7bff3dfcec111f6b6ba21fdbcdeb7540fc55ee1d57ef504fd625dd8d7dc11df2ab9ef18d33c25732755340d6c930450d56e37554c59be852efbe3081f0162a145851f16dd014d89c62039aa76cd570ded3c74ed5e166e31dbfe1cf46edfcb7d813f50a359bd8b27cdc867a973f7810046d16d8be471f401388333e72ffa552e20af9e3cecdd8fea83dc781dfdeefa578b4bf18144a69b1f1ae5bb41e3bc291899f23340c2423917d7fd324efe08979bddf92602912dba5ff8604cf8b4d79150d9faac5681be2b61c1aa2f172a42debb849d0946c94b55d847783743b0f3a9fb0e0f999d24efcf9df";

export class FileProductLoader implements ProductLoader {
  constructor(private filePath: string) {}
  async getProducts(): Promise<Product[]> {
    try {
      const file = await Deno.readTextFile(this.filePath);
      return JSON.parse(file);
    } catch (e) {
      console.error(e);
      throw new Error("File not found");
    }
  }

  async load(): Promise<void> {
    const res = await fetch(AMAZON_PRODUCTS_ZIP_URL);
    const file = await Deno.open(this.filePath, {
      write: true,
      create: true,
    });

    await res.body
      ?.pipeThrough(new ZipReaderStream())
      .pipeThrough(
        new TransformStream({
          async transform({ readable }, controller) {
            if (readable?.values == null) {
              controller.error("No readable stream");
              return;
            }

            const values = readable.values();

            for await (const value of values) {
              controller.enqueue(value);
            }
          },
        })
      )
      .pipeThrough(new TransformStream(new CsvStream()))
      .pipeThrough(new TransformStream(new ItemTransformer("B07GH67QC8")))

      .pipeThrough(new TextEncoderStream())
      .pipeTo(file.writable);
  }

  async isLoaded(): Promise<boolean> {
    try {
      await Deno.stat(this.filePath);
      return true;
    } catch (e) {
      return false;
    }
  }

  async clear(): Promise<void> {
    await Deno.writeTextFile(this.filePath, "[]");
  }
}
