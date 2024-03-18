import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { orderRouter } from "./routes/order-route";
import "dotenv/config";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL!);

const app = new Hono();

app.route("/", orderRouter);
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
