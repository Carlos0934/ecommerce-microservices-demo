using Inventory.Clients;
using Inventory.Database;
using Inventory.Endpoints;
using Inventory.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddHttpClient("catalog-service", client =>
{
    client.BaseAddress = new Uri(Environment.GetEnvironmentVariable("CATALOG_SERVICE_URL") ?? "http://localhost:3000");
});

builder.Services.AddScoped<CatalogClient>();
builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<StockService>();

builder.Services.AddDbContext<InventoryContext>(options => options.UseInMemoryDatabase("InventoryDB"));
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

StockEndpoints.MapEndpoints(app);
TransactionEndpoints.MapEndpoints(app);


app.Run();
