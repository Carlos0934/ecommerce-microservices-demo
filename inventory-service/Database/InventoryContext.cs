
namespace Inventory.Database;

using Inventory.Entities;
using Microsoft.EntityFrameworkCore;

public class InventoryContext : DbContext
{
    public DbSet<Transaction> Transactions { get; set; }

    public InventoryContext(DbContextOptions<InventoryContext> options) : base(options)
    {
    }


}