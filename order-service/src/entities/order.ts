import { Document } from "mongoose";
import { OrderDocument } from "../models/order-model";

export enum OrderStatus {
  Pending = "pending",
  Completed = "completed",
  Cancelled = "cancelled",
}

export class OrderLine {
  constructor(
    public productId: string,
    public quantity: number,
    public price: number,
    public transactionId?: string
  ) {}

  public get total(): number {
    return this.quantity * this.price;
  }
}

export class Order {
  constructor(
    public id: string,
    public items: OrderLine[],
    public date: Date,
    public status: OrderStatus
  ) {}

  public get total(): number {
    return this.items.reduce((total, item) => total + item.total, 0);
  }

  public static fromDocument(document: OrderDocument): Order {
    const { _id, items, date, status } = document.toObject();
    return new Order(
      _id.toString(),
      items.map(
        (item) => new OrderLine(item.productId, item.quantity, item.price)
      ),
      date,
      status as OrderStatus
    );
  }
}
