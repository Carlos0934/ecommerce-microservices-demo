namespace Inventory.Entities;

public class Transaction
{



    public Guid Id { get; set; }

    public required string ProductId { get; set; }

    public required int Quantity { get; set; }

    public required DateTime CreatedAt { get; set; }

}