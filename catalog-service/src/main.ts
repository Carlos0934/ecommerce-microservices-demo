import { FileProductLoader } from "../src/services/file-product-loader.ts";
import { ProductRepository } from "../src/services/product-repository.ts";
import { seed } from "../src/utils/seed.ts";
import { Hono } from "https://deno.land/x/hono@v4.0.0-rc.4/mod.ts";

await fetch("https://google.com");
const productLoader = new FileProductLoader("products.json");

const productRepository = new ProductRepository(productLoader);

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
  await seed(productLoader);
  return new Response("OK");
});

Deno.serve(app.fetch);
