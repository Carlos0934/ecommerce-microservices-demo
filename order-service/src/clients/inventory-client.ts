import { CreateTransactionInput } from "../schemas/transaction-schema";

export class InventoryApiClient {
  constructor(private readonly baseUrl: string) {}

  public async createTransaction(
    input: CreateTransactionInput
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`Failed to create transaction: ${response.statusText}`);
    }

    const data = await response.json();

    return data.id;
  }

  public async deleteTransaction(transactionId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/transactions/${transactionId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to delete transaction ${transactionId}: ${response.statusText}`
      );
    }
  }

  public async getStock(productId: string): Promise<number> {
    const response = await fetch(`${this.baseUrl}/stocks/${productId}`);

    if (!response.ok) {
      throw new Error(`Failed to get stock for product ${productId}`);
    }

    const data = await response.json();

    return data.quantity;
  }
}
