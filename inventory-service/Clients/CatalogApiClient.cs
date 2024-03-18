
namespace Inventory.Clients;


using System.Net.Http;
using System.Threading.Tasks;


public class CatalogClient
{

    private readonly IHttpClientFactory _httpClientFactory;
    public CatalogClient(IHttpClientFactory httpClientFactory
)
    {
        _httpClientFactory = httpClientFactory;
    }

    // create a function to check if a product exists
    public async Task<bool> ProductExists(string productId)
    {
        var client = _httpClientFactory.CreateClient("catalog-service");
        var response = await client.GetAsync($"/products/{productId}");
        return response.IsSuccessStatusCode;
    }
}