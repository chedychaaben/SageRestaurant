using Microsoft.EntityFrameworkCore;


namespace Sage.Models;
public class DrinkCartRepository : IDrinkCartRepository
{
    private readonly AppDbContext context;
    public DrinkCartRepository(AppDbContext context)
    {
        this.context = context;
    }

    public async Task<DrinkCart> Add(DrinkCart drinkCart)
    {
        await context.DrinkCarts.AddAsync(drinkCart);
        await context.SaveChangesAsync();
        return drinkCart;
    }

    public async Task<DrinkCart> Get(int Id)
    {
        return await context.DrinkCarts
            .FirstOrDefaultAsync(dc => dc.Id == Id);
    }

    public async Task<DrinkCart> GetByDrinkandCart(int DrinkId, int CartId)
    {
        return await context.DrinkCarts
                .FirstOrDefaultAsync(dc => dc.DrinkId == DrinkId && dc.CartId == CartId);
    }

    public async Task<DrinkCart> AddQuantity(int Id)
    {
        var drinkCart = await Get(Id);
        if (drinkCart == null)
        {
            return null;
        }
        drinkCart.Quantity += 1;
        context.DrinkCarts.Update(drinkCart);
        await context.SaveChangesAsync();
        return drinkCart;
    }

    public async Task<DrinkCart> RemoveQuantity(int Id)
    {
        var drinkCart = await Get(Id);
        if (drinkCart == null)
        {
            return null;
        }
        drinkCart.Quantity -= 1;
        if (drinkCart.Quantity <= 0)
        {
            context.DrinkCarts.Remove(drinkCart);
        }
        else
        {
            context.DrinkCarts.Update(drinkCart);
        }
        await context.SaveChangesAsync();
        return drinkCart;
    }

    public async Task<IEnumerable<DrinkCart>> GetAll()
    {
        return await context.DrinkCarts.ToListAsync();
    }

    public async Task Edit(DrinkCart drinkCart)
    {
        context.DrinkCarts.Update(drinkCart);
        await context.SaveChangesAsync();
    }

    public async Task Delete(DrinkCart drinkCart)
    {
        context.DrinkCarts.Remove(drinkCart);
        await context.SaveChangesAsync();
    }

}
