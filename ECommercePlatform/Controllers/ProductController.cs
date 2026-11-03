using ECommercePlatform.Data;
using ECommercePlatform.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommercePlatform.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return Ok(await context.Products.AsNoTracking().ToListAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> AddProduct(Product product)
    {
        if (string.IsNullOrWhiteSpace(product.Name))
        {
            return BadRequest("Product name is required.");
        }

        if (product.Price < 0 || product.Quantity < 0)
        {
            return BadRequest("Price and quantity cannot be negative.");
        }

        context.Products.Add(product);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }
}
