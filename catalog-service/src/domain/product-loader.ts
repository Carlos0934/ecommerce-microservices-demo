import { Product } from "./item.ts";

export interface ProductLoader {
  load(): Promise<void>;

  isLoaded(): Promise<boolean>;

  clear(): Promise<void>;

  getProducts(): Promise<Product[]>;
}
