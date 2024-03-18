
using Inventory.Clients;
using Inventory.Database;
using Inventory.Entities;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Services;

public class StockService
{
    private readonly InventoryContext _context;
    private readonly CatalogClient _catalogClient;

    public StockService(InventoryContext context, CatalogClient catalogClient)
    {
        _context = context;
        _catalogClient = catalogClient;

    }

    public List<Stock> GetStocks()
    {
        var transactions = _context.Transactions.AsNoTracking().ToList();
        var stocks = transactions.GroupBy(t => t.ProductId)
            .Select(g => new Stock
            {
                ProductId = g.Key,
                Quantity = g.Sum(t => t.Quantity)
            }).ToList();

        return stocks;
    }

    public async Task<Stock?> GetStock(string productId)
    {

        var productExists = await _catalogClient.ProductExists(productId);

        if (!productExists)
        {
            return null;
        }
        var transactions = await _context.Transactions.AsNoTracking().Where(t => t.ProductId == productId).ToListAsync();

        var quantity = transactions.Sum(t => t.Quantity);

        var stock = new Stock
        {
            ProductId = productId,
            Quantity = quantity
        };

        return stock;

    }
}
