import { CatalogApiClient } from "../clients/catalog-client";
import { InventoryApiClient } from "../clients/inventory-client";
import { Order, OrderLine, OrderStatus } from "../entities/order";
import { OrderModel } from "../models/order-model";
import { CreateOrderInput, UpdateOrderInput } from "../schemas/order-schema";

export class OrderService {
  constructor(
    private readonly catalogClient: CatalogApiClient,
    private readonly inventoryClient: InventoryApiClient
  ) {}

  public async createOrder(input: CreateOrderInput) {
    const order = await OrderModel.create(input);

    await this.validateProductIdsExist(input.items as OrderLine[]);
    return Order.fromDocument(order);
  }

  public async updateOrder(input: UpdateOrderInput) {
    const order = await this.validateIfOrderCanBeUpdated(input.id);

    await this.validateProductIdsExist(input.items as OrderLine[]);

    order.items.splice(0, order.items.length);

    order.items.push(...(input.items as OrderLine[]));

    await order.save();

    return Order.fromDocument(order);
  }

  public async cancelOrder(orderId: string) {
    const order = await this.validateIfOrderCanCancel(orderId);
    order.status = OrderStatus.Cancelled;

    await order.save();

    return order;
  }

  public async completeOrder(orderId: string) {
    const order = await this.validateIfOrderCanBeCompleted(orderId);
    order.status = OrderStatus.Completed;

    const ids = await Promise.all([
      ...order.items.map((item) =>
        this.inventoryClient.createTransaction({
          productId: item.productId,
          quantity: -item.quantity,
          date: order.date.toJSON(),
        })
      ),
    ]);

    order.items.forEach((item, index) => {
      item.transactionId = ids[index];
    });

    await order.save();

    return order;
  }

  public async getOrderById(orderId: string) {
    const order = await OrderModel.findById(orderId).exec();
    if (!order) throw new Error(`Order with id ${orderId} not found`);

    return Order.fromDocument(order);
  }

  public async getAllOrders() {
    const orders = await OrderModel.find().exec();
    return orders.map(Order.fromDocument);
  }

  public async deleteOrder(orderId: string) {
    const order = await OrderModel.findById(orderId).exec();
    if (!order) throw new Error(`Order with id ${orderId} not found`);

    const results = await Promise.allSettled(
      order.items.map((item) =>
        this.inventoryClient.deleteTransaction(item.transactionId!)
      )
    );

    if (results.some((result) => result.status === "rejected")) {
      await this.restoreTransactions(order, results);
      throw new Error(
        `Failed to delete transactions for order with id ${orderId}`
      );
    }

    await OrderModel.deleteOne({ _id: orderId });
  }

  private async restoreTransactions(
    order: Order,
    results: PromiseSettledResult<void>[]
  ) {
    const itemsByTransactionId = order.items.reduce<Record<string, OrderLine>>(
      (acc, item) => {
        if (item.transactionId) {
          acc[item.transactionId] = item;
        }
        return acc;
      },
      {}
    );

    const fulfilledTransactionIds = results.reduce<string[]>(
      (acc, result, index) =>
        result.status === "fulfilled"
          ? [...acc, order.items[index].transactionId!]
          : acc,
      []
    );

    // Revert the transactions that were successfully deleted if error occurred

    await Promise.all(
      fulfilledTransactionIds.map((transactionId) =>
        this.inventoryClient.createTransaction({
          productId: itemsByTransactionId[transactionId].productId,
          quantity: itemsByTransactionId[transactionId].quantity,
          date: order.date.toJSON(),
        })
      )
    );
  }

  private async validateProductIdsExist(items: OrderLine[]) {
    const results = await Promise.all(
      items.map((item) => this.catalogClient.checkProductExists(item.productId))
    );

    for (let result of results) {
      if (!result) throw new Error(`Product with id ${result} not found`);
    }
  }
  private async validateIfOrderCanBeUpdated(orderId: string) {
    const orderFound = await OrderModel.findById(orderId).exec();

    if (!orderFound) throw new Error(`Order with id ${orderId} not found`);

    if (orderFound.status !== OrderStatus.Pending)
      throw new Error(
        `Order status is ${orderFound.status} and cannot be updated`
      );

    return orderFound;
  }

  private async validateIfOrderCanCancel(orderId: string) {
    const orderFound = await OrderModel.findById(orderId).exec();

    if (!orderFound) throw new Error(`Order with id ${orderId} not found`);

    if (orderFound.status !== OrderStatus.Completed)
      throw new Error(
        `Order status is ${orderFound.status} and cannot be cancelled`
      );

    return orderFound;
  }

  private async validateIfOrderCanBeCompleted(orderId: string) {
    const orderFound = await OrderModel.findById(orderId).exec();

    if (!orderFound) throw new Error(`Order with id ${orderId} not found`);

    if (orderFound.status == OrderStatus.Cancelled)
      throw new Error(
        `Order status is ${orderFound.status} and cannot be completed`
      );

    if (orderFound.items.length === 0)
      throw new Error(`Order with id ${orderId} has no items`);

    if (orderFound.items.some((item) => item.quantity <= 0))
      throw new Error(
        `Order with id ${orderId} has items with quantity less than or equal to 0`
      );

    if (orderFound.items.some((item) => item.price <= 0))
      throw new Error(
        `Order with id ${orderId} has items with price less than or equal to 0`
      );

    return orderFound;
  }
}
