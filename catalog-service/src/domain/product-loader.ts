import { Product } from "./item";

export interface ProductLoader {
  getProducts(): Promise<Product[]>;
}
