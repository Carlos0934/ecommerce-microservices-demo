import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "@redis/client";
import { Product } from "../domain/item";
import { ProductLoader } from "../domain/product-loader";

export class RedisProductLoader implements ProductLoader {
  private readonly client: RedisClientType<
    RedisModules,
    RedisFunctions,
    RedisScripts
  >;

  constructor(private readonly productLoader: ProductLoader, url: string) {
    this.client = createClient({
      url,
    });
  }

  async getProducts(): Promise<Product[]> {
    try {
      await this.client.connect();
      let productsData = await this.client.get("products");

      if (!productsData) {
        const products = await this.productLoader.getProducts();

        await this.client.set("products", JSON.stringify(products), {
          EX: 60 * 60 * 24,
        });

        return products;
      }

      return JSON.parse(productsData);
    } catch (error) {
      console.error(error);
      throw new Error("Error");
    } finally {
      await this.client.disconnect();
    }
  }
}
