import { Hono } from "hono";
import { OrderService } from "../services/order-service";
import { createOrderSchema } from "../schemas/order-schema";
import { CatalogApiClient } from "../clients/catalog-client";
import { InventoryApiClient } from "../clients/inventory-client";

const inventoryBaseUrl = process.env.INVENTORY_SERVICE_URL!;
const catalogBaseUrl = process.env.CATALOG_SERVICE_URL!;

const catalogClient = new CatalogApiClient(catalogBaseUrl);
const inventoryClient = new InventoryApiClient(inventoryBaseUrl);
const orderService = new OrderService(catalogClient, inventoryClient);

export const orderRouter = new Hono();

orderRouter.get("/orders", async (c) => {
  const orders = await orderService.getAllOrders();
  return c.json(orders);
});

orderRouter.get("/orders/:id", async (c) => {
  const id = c.req.param("id");
  const order = await orderService.getOrderById(id);
  return c.json(order);
});

orderRouter.post("/orders", async (c) => {
  const data = c.req.json();
  const input = createOrderSchema.parse(data);
  const order = await orderService.createOrder(input);
  return c.json(order);
});

orderRouter.put("/orders/:id", async (c) => {
  const id = c.req.param("id");
  const data = c.req.json();
  const input = createOrderSchema.parse(data);
  const order = await orderService.updateOrder({ ...input, id });
  return c.json(order);
});

orderRouter.patch("/orders/:id/cancel", async (c) => {
  const id = c.req.param("id");
  const order = await orderService.cancelOrder(id);
  return c.json(order);
});

orderRouter.patch("/orders/:id/complete", async (c) => {
  const id = c.req.param("id");
  const order = await orderService.completeOrder(id);
  return c.json(order);
});

orderRouter.delete("/orders/:id", async (c) => {
  const id = c.req.param("id");
  await orderService.deleteOrder(id);
  return c.text("Order deleted");
});
