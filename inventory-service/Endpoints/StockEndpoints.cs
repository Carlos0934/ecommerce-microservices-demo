namespace Inventory.Endpoints;

using Inventory.Entities;
using Inventory.Database;
using Microsoft.EntityFrameworkCore;
using Inventory.Services;

public class StockEndpoints
{
    public static void MapEndpoints(WebApplication app)
    {


        app.MapGet("/stocks", (StockService stockService) =>
        {
            var stocks = stockService.GetStocks();
            return Results.Ok(stocks);
        });


        app.MapGet("/stocks/{productId}", async (string productId, StockService stockService) =>
        {
            var stock = await stockService.GetStock(productId);
            if (stock is null)
            {
                return Results.NotFound();
            }

            return Results.Ok(stock);
        });


    }
}
