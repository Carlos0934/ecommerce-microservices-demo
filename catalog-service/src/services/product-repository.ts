import { Product } from "../domain/item";
import { ProductLoader } from "../domain/product-loader";

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
