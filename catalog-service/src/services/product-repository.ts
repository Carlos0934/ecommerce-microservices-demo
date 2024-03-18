import { Product } from "../domain/item.ts";
import { ProductLoader } from "../domain/product-loader.ts";

export class ProductRepository {
  constructor(private productLoader: ProductLoader) {}

  getProducts(): Promise<Product[]> {
    return this.productLoader.getProducts();
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  }
}
