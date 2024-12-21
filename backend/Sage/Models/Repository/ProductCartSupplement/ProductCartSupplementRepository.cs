using Microsoft.EntityFrameworkCore;
namespace Sage.Models
{
    public class ProductCartSupplementRepository : IProductCartSupplementRepository
    {
        private readonly AppDbContext context;
        public ProductCartSupplementRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<ProductCartSupplement> Add(ProductCartSupplement productcartsupplement)
        {
            var result = await context.ProductCartSupplements.AddAsync(productcartsupplement);
            await context.SaveChangesAsync();
            return result.Entity;
        }


        public async Task<List<ProductCartSupplement>> GetAll()
        {
            List<ProductCartSupplement> ProductCartSupplements = await context.ProductCartSupplements.ToListAsync();
            return ProductCartSupplements;
        }

        public async Task<ProductCartSupplement> Get(int Id)
        {
            return await context.ProductCartSupplements.FirstOrDefaultAsync(p => p.Id == Id);
        }

        public async Task<ProductCartSupplement> GetByName(string Name)
        {
            return await context.ProductCartSupplements.FirstOrDefaultAsync(p => p.Name == Name);
        }

        public async Task<ProductCartSupplement> Edit(ProductCartSupplement productcartsupplement)
        {
            context.ProductCartSupplements.Update(productcartsupplement);
            await context.SaveChangesAsync();
            return productcartsupplement;
        }
        public async Task Delete(int id)
        {
            var productcartsupplement = await context.ProductCartSupplements.FindAsync(id);
            context.ProductCartSupplements.Remove(productcartsupplement);
            await context.SaveChangesAsync();
        }


        public async Task<List<ProductCartSupplement>> GetByIds(IEnumerable<int> ListOfIds)
        {
            return await context.ProductCartSupplements
                .Where(i => ListOfIds.Contains(i.Id))
                .ToListAsync();
        }
    }
}
