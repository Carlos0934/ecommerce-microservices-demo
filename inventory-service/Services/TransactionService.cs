
namespace Inventory.Services;

using Inventory.Clients;
using Inventory.Database;
using Inventory.Entities;
using Microsoft.EntityFrameworkCore;

public class TransactionService
{

    private readonly InventoryContext _context;
    private readonly CatalogClient _catalogClient;


    public TransactionService(InventoryContext context, CatalogClient catalogClient)
    {
        _context = context;
        _catalogClient = catalogClient;
    }

    public async Task<List<Transaction>> GetTransactions()
    {
        return await _context.Transactions.AsNoTracking().ToListAsync();
    }

    public ValueTask<Transaction?> GetTransaction(Guid id)
    {
        return _context.Transactions.FindAsync(id);
    }

    public async Task<Transaction> CreateTransaction(Transaction transaction)
    {

        var productExists = await _catalogClient.ProductExists(transaction.ProductId);

        if (!productExists)
        {
            throw new InvalidDataException("Product does not exist");
        }

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task<bool> DeleteTransaction(Guid id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction is null)
        {
            return false;
        }

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
        return true;
    }

}