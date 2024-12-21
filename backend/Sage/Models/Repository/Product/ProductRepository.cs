using Microsoft.EntityFrameworkCore;
namespace Sage.Models
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext context;
        public ProductRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<Product> Add(Product prod)
        {
            var result = await context.Products.AddAsync(prod);
            await context.SaveChangesAsync();
            return result.Entity;
        }


        public async Task<List<Product>> GetAll()
        {
            List<Product> Products = await context.Products
                        .Include(c => c.Ingredients)
                        .Include(c => c.Supplements)
                        .Include(c => c.Images)
                        .ToListAsync();
            return Products;
        }

        public async Task<Product> Get(int Id)
        {
            return await context.Products
                        .Include(c => c.Ingredients)
                        .Include(c => c.Supplements)
                        .Include(c => c.Images)
                        .FirstOrDefaultAsync(p => p.Id == Id);
        }

        public async Task<Product> GetByName(string Name)
        {
            return await context.Products
                        .Include(c => c.Ingredients)
                        .Include(c => c.Supplements)
                        .Include(c => c.Images)
                        .FirstOrDefaultAsync(p => p.Name == Name);
        }

        public async Task<Product> Edit(Product prod)
        {
            context.Products.Update(prod);
            await context.SaveChangesAsync();
            return prod;
        }
        public async Task Delete(int id)
        {
            var prod = await context.Products.FindAsync(id);
            context.Products.Remove(prod);
            await context.SaveChangesAsync();
        }

    }
}
