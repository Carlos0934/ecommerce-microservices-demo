import { z } from "zod";

export const createTransactionSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  date: z.string(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
