import { ProductRepository } from "./services/product-repository";
import { Hono } from "hono";
import { S3FileService } from "./services/s3-file-service";
import { S3 } from "@aws-sdk/client-s3";
import "dotenv/config";
import { S3ProductLoader } from "./services/s3-product-loader";
import { RedisProductLoader } from "./services/redis-product-loader";
import { serve } from "@hono/node-server";

const s3 = new S3({
  region: "us-east-2",
});

const fileService = new S3FileService(s3);
const productLoader = new S3ProductLoader(fileService);
const redisProductLoader = new RedisProductLoader(
  productLoader,
  process.env.REDIS_URL!
);

const productRepository = new ProductRepository(redisProductLoader);

const app = new Hono();

app.get("/products", async (ctx) => {
  const products = await productRepository.getProducts();
  return Response.json(products);
});

app.get("/products/:id", async (ctx) => {
  const id = ctx.req.param("id");

  const product = await productRepository.getProduct(id);
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }
  return Response.json(product);
});

app.get("/health", async (ctx) => {
  return new Response("OK");
});

console.log("Server running on port 8000");
serve({
  fetch: app.fetch,
  port: 8000,
});
