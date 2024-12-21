using Microsoft.EntityFrameworkCore;
namespace Sage.Models
{
    public class ProductOfTheDayRepository : IProductOfTheDayRepository
    {
        private readonly AppDbContext context;
        public ProductOfTheDayRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<ProductOfTheDay> Add(ProductOfTheDay prod)
        {
            var result = await context.ProductOfTheDays.AddAsync(prod);
            await context.SaveChangesAsync();
            return result.Entity;
        }


        public async Task<List<ProductOfTheDay>> GetAll()
        {
            List<ProductOfTheDay> ProductOfTheDays = await context.ProductOfTheDays.ToListAsync();
            return ProductOfTheDays;
        }

        public async Task<ProductOfTheDay> Get(int Id)
        {
            return await context.ProductOfTheDays.FirstOrDefaultAsync(p => p.Id == Id);
        }

        public async Task<ProductOfTheDay> GetByProductId(int ProductId)
        {
            return await context.ProductOfTheDays.FirstOrDefaultAsync(p => p.ProductId == ProductId);
        }

        public async Task<ProductOfTheDay> Edit(ProductOfTheDay prod)
        {
            context.ProductOfTheDays.Update(prod);
            await context.SaveChangesAsync();
            return prod;
        }
        public async Task Delete(int id)
        {
            var prod = await context.ProductOfTheDays.FindAsync(id);
            context.ProductOfTheDays.Remove(prod);
            await context.SaveChangesAsync();
        }

    }
}
