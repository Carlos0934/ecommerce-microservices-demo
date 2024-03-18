import { ProductLoader } from "../domain/product-loader.ts";

/**
 * Fetches products from an Amazon products zip and seeds them into a file.
 * @returns {Promise<void>} A promise that resolves when the seeding is complete.
 */
export async function seed(productLoader: ProductLoader): Promise<void> {
  if (await productLoader.isLoaded()) {
    console.log("Products already seeded");
    return;
  }

  console.log("Seeding products");

  await productLoader.load();

  console.log("Seeding complete");
}
