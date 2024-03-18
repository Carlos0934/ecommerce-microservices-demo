import * as mongoose from "mongoose";
import { Order, OrderLine, OrderStatus } from "../entities/order";

const Schema = mongoose.Schema;

const OrderLineSchema = new Schema({
  productId: String,
  quantity: Number,
  transactionId: String,
  price: Number,
});

export const OrderSchema = new Schema<Order>({
  items: [OrderLineSchema],
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: OrderStatus.Pending,
    enum: Object.values(OrderStatus),
  },
}); // Add 'as any' to fix the type error

export const OrderModel = mongoose.model<Order>("order", OrderSchema);

export type OrderDocument = mongoose.Document<unknown, {}, Order>;
