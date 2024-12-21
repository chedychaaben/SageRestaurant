using Microsoft.EntityFrameworkCore;


namespace Sage.Models;
public class ProductCartRepository : IProductCartRepository
{
    private readonly AppDbContext context;
    public ProductCartRepository(AppDbContext context)
    {
        this.context = context;
    }

    public async Task<ProductCart> Add(ProductCart productCart)
    {
        await context.ProductCarts.AddAsync(productCart);
        await context.SaveChangesAsync();
        return productCart;
    }

    public async Task<ProductCart> Get(int ProductId, int CartId)
    {
        return await context.ProductCarts
                .Include(pc => pc.ProductCartIngredients)
                .Include(pc => pc.ProductCartSupplements)
                .FirstOrDefaultAsync(pc => pc.ProductId == ProductId && pc.CartId == CartId);
    }

    public async Task<ProductCart> AddQuantity(int productId, int cartId)
    {
        var productCart = await Get(productId, cartId);
        if (productCart == null)
        {
            return null;
        }
        productCart.Quantity += 1;
        context.ProductCarts.Update(productCart);
        await context.SaveChangesAsync();
        return productCart;
    }

    public async Task<ProductCart> RemoveQuantity(int productId, int cartId)
    {
        var productCart = await Get(productId, cartId);
        if (productCart == null)
        {
            return null;
        }
        productCart.Quantity -= 1;
        if (productCart.Quantity <= 0)
        {
            context.ProductCarts.Remove(productCart);
        }
        else
        {
            context.ProductCarts.Update(productCart);
        }
        await context.SaveChangesAsync();
        return productCart;
    }

    public async Task<IEnumerable<ProductCart>> GetAll()
    {
        return await context.ProductCarts.ToListAsync();
    }

    public async Task Edit(ProductCart productCart)
    {
        context.ProductCarts.Update(productCart);
        await context.SaveChangesAsync();
    }

    public async Task Delete(ProductCart productCart)
    {
        context.ProductCarts.Remove(productCart);
        await context.SaveChangesAsync();
    }

}
