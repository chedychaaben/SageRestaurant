using Microsoft.EntityFrameworkCore;
namespace Sage.Models
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext context;
        public OrderRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<Order> Add(Order order)
        {
            var result = await context.Orders.AddAsync(order);
            await context.SaveChangesAsync();
            return result.Entity;
        }


        public async Task<List<Order>> GetAll()
        {
            List<Order> Orders = await context.Orders
                                   .Include(o => o.Cart) // Include related Cart for each Order
                                       .ThenInclude(c => c.ProductCarts) // Include related ProductCarts within Cart
                                   .Include(o => o.Cart) // Include related Cart again (for DrinkCarts)
                                       .ThenInclude(c => c.DrinkCarts) // Include related DrinkCarts within Cart
                                   .ToListAsync();
            return Orders;
        }

        public async Task<Order> Get(int Id)
        {
            return await context.Orders
                                   .Include(o => o.Cart) // Include related Cart for each Order
                                       .ThenInclude(c => c.ProductCarts) // Include related ProductCarts within Cart
                                   .Include(o => o.Cart) // Include related Cart again (for DrinkCarts)
                                       .ThenInclude(c => c.DrinkCarts) // Include related DrinkCarts within Cart
                                    .FirstOrDefaultAsync(o => o.Id == Id);
        }

        public async Task<List<Order>> GetOrdersForUser(Guid userId)
        {
            List<Order> orders = await context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Cart) // Include related Cart for each Order
                    .ThenInclude(c => c.ProductCarts) // Include related ProductCarts within Cart
                        .ThenInclude(pc => pc.ProductCartIngredients) // Include related ProductCartIngredients within ProductCarts
                    .Include(o => o.Cart) // Include related Cart again (for DrinkCarts)
                        .ThenInclude(c => c.DrinkCarts) // Include related DrinkCarts within Cart
                    .Include(o => o.Cart) // Include related Cart again (for ProductCartSupplements)
                        .ThenInclude(c => c.ProductCarts) // Include related ProductCarts within Cart
                            .ThenInclude(pc => pc.ProductCartSupplements) // Include related ProductCartSupplements directly from ProductCarts
                .ToListAsync();

            return orders;
        }

        public async Task<Order> Edit(Order order)
        {
            context.Orders.Update(order);
            await context.SaveChangesAsync();
            return order;
        }
        public async Task Delete(int Id)
        {
            var order = await context.Orders.FindAsync(Id);
            context.Orders.Remove(order);
            await context.SaveChangesAsync();
        }

    }
}
