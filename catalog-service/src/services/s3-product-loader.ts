import { Product } from "../domain/item";
import { ProductLoader } from "../domain/product-loader";
import { S3FileService } from "./s3-file-service";

export class S3ProductLoader implements ProductLoader {
  constructor(private readonly fileService: S3FileService) {}
  async getProducts(): Promise<Product[]> {
    const data = await this.fileService.downloadFile(
      "ecommerce-amazon-products",
      "products.json"
    );

    const textDecoder = new TextDecoder();

    const products = JSON.parse(textDecoder.decode(data));

    return products;
  }
}
