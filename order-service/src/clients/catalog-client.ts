export class CatalogApiClient {
  constructor(private baseUrl: string) {}

  public async checkProductExists(productId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/products/${productId}`);

    if (!response.ok) {
      throw new Error(
        `Failed to get product ${productId}: ${response.statusText}`
      );
    }

    return response.status === 200;
  }
}
