import { z } from "zod";

export const orderLineSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  price: z.number(),
  transactionId: z.string().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderLineSchema),
  date: z.string(),
});

export const updateOrderSchema = z.object({
  ...createOrderSchema.shape,
  id: z.string(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
