
namespace Inventory.Endpoints;

using Inventory.Entities;
using Inventory.Services;

public class TransactionEndpoints
{
    public static void MapEndpoints(WebApplication app)
    {
        app.MapGet("/transactions", async (TransactionService transactionService) =>
       {

           var transactions = await transactionService.GetTransactions();

           return Results.Ok(transactions);
       });

        app.MapGet("/transactions/{id}", async (Guid id, TransactionService transactionService) =>
        {
            var transaction = await transactionService.GetTransaction(id);
            if (transaction is null)
            {
                return Results.NotFound();
            }

            return Results.Ok(transaction);
        });



        app.MapPost("/transactions", async (Transaction transaction, TransactionService transactionService) =>
        {
            try
            {
                var createdTransaction = await transactionService.CreateTransaction(transaction);
                return Results.Created($"/transactions/{createdTransaction.Id}", createdTransaction);
            }
            catch (InvalidDataException ex)
            {

                return Results.BadRequest(ex.Message);
            }


        });


        app.MapDelete("/transactions/{id}", async (Guid id, TransactionService transactionService) =>
        {
            var deleted = await transactionService.DeleteTransaction(id);
            if (!deleted)
            {
                return Results.NotFound();
            }

            return Results.NoContent();
        });

    }
}