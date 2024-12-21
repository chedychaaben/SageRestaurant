using Microsoft.EntityFrameworkCore;
namespace Sage.Models
{
    public class ProductCartIngredientRepository : IProductCartIngredientRepository
    {
        private readonly AppDbContext context;
        public ProductCartIngredientRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<ProductCartIngredient> Add(ProductCartIngredient productcartingredient)
        {
            var result = await context.ProductCartIngredients.AddAsync(productcartingredient);
            await context.SaveChangesAsync();
            return result.Entity;
        }


        public async Task<List<ProductCartIngredient>> GetAll()
        {
            List<ProductCartIngredient> ProductCartIngredients = await context.ProductCartIngredients.ToListAsync();
            return ProductCartIngredients;
        }

        public async Task<ProductCartIngredient> Get(int Id)
        {
            return await context.ProductCartIngredients.FirstOrDefaultAsync(p => p.Id == Id);
        }

        public async Task<ProductCartIngredient> GetByName(string Name)
        {
            return await context.ProductCartIngredients.FirstOrDefaultAsync(p => p.Name == Name);
        }

        public async Task<ProductCartIngredient> Edit(ProductCartIngredient productcartingredient)
        {
            context.ProductCartIngredients.Update(productcartingredient);
            await context.SaveChangesAsync();
            return productcartingredient;
        }
        public async Task Delete(int id)
        {
            var prod = await context.ProductCartIngredients.FindAsync(id);
            context.ProductCartIngredients.Remove(prod);
            await context.SaveChangesAsync();
        }

        public async Task<List<ProductCartIngredient>> GetByIds(IEnumerable<int> ListOfIds)
        {
            return await context.ProductCartIngredients
                .Where(i => ListOfIds.Contains(i.Id))
                .ToListAsync();
        }

    }
}
