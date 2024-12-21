using Microsoft.EntityFrameworkCore;
namespace Sage.Models
{
    public class CartRepository : ICartRepository
    {
        private readonly AppDbContext context;
        public CartRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<Cart> Add(Cart cart)
        {
            var result = await context.Carts.AddAsync(cart);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Cart> Get(int Id)
        {
            return await context.Carts
                .Include(c => c.ProductCarts)
                    .ThenInclude(pc => pc.ProductCartIngredients)
                .Include(c => c.ProductCarts)
                    .ThenInclude(pc => pc.ProductCartSupplements)
                .Include(c => c.DrinkCarts)
                .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<Cart> GetByUserId(Guid UserId)
        {
            // Try to find an existing cart for the user
            var cart = await context.Carts
                .Include(c => c.ProductCarts)
                    .ThenInclude(pc => pc.ProductCartIngredients)
                .Include(c => c.ProductCarts)
                    .ThenInclude(pc => pc.ProductCartSupplements)
                .Include(c => c.DrinkCarts)
                .FirstOrDefaultAsync(c => c.UserId == UserId && !c.IsOrdered);

            // If the cart doesn't exist, create a new one
            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = UserId,
                    IsOrdered = false, // Assuming the default value is false, adjust as needed
                    ProductCarts = new List<ProductCart>(), // Initialize collections as needed
                    DrinkCarts = new List<DrinkCart>()     // Initialize collections as needed
                };

                // Add the new cart to the context and save changes
                context.Carts.Add(cart);
                await context.SaveChangesAsync();
            }

            return cart;
        }

        public async Task<Cart> Edit(Cart cart)
        {
            context.Carts.Update(cart);
            await context.SaveChangesAsync();
            return cart;
        }

        public async Task<Cart> SetToOrdered(int id)
        {
            // Retrieve the cart by Id
            var cart = await context.Carts.FindAsync(id);
            // Update the specific boolean column
            cart.IsOrdered = true;
            // Save the changes to the database
            context.Carts.Update(cart);
            await context.SaveChangesAsync();
            return cart;
        }

    }
}
