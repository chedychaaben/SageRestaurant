using Microsoft.EntityFrameworkCore;
namespace Sage.Models
{
    public class IngredientRepository : IIngredientRepository
    {
        private readonly AppDbContext context;
        public IngredientRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<Ingredient> Add(Ingredient ingredient)
        {
            var result = await context.Ingredients.AddAsync(ingredient);
            await context.SaveChangesAsync();
            return result.Entity;
        }


        public async Task<List<Ingredient>> GetAll()
        {
            List<Ingredient> Ingredients = await context.Ingredients.ToListAsync();
            return Ingredients;
        }

        public async Task<Ingredient> Get(int Id)
        {
            return await context.Ingredients.FirstOrDefaultAsync(p => p.Id == Id);
        }

        public async Task<Ingredient> GetByName(string Name)
        {
            return await context.Ingredients.FirstOrDefaultAsync(i => i.Name == Name);
        }

        public async Task<Ingredient> GetByProductIdandName(int ProductId, string Name)
        {
            return await context.Ingredients.FirstOrDefaultAsync(i => i.Name == Name && i.ProductId == ProductId);
        }

        public async Task<Ingredient> Edit(Ingredient prod)
        {
            context.Ingredients.Update(prod);
            await context.SaveChangesAsync();
            return prod;
        }
        public async Task Delete(int id)
        {
            var ingredient = await context.Ingredients.FindAsync(id);
            context.Ingredients.Remove(ingredient);
            await context.SaveChangesAsync();
        }

        public async Task<List<Ingredient>> GetByIds(IEnumerable<int> ListOfIds)
        {
            return await context.Ingredients
                .Where(i => ListOfIds.Contains(i.Id))
                .ToListAsync();
        }

    }
}
