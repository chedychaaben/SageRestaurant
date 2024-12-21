using Microsoft.EntityFrameworkCore;

namespace Sage.Models
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly AppDbContext context;
        public CategoryRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<Category> Add(Category cat)
        {
            var result = await context.Categories.AddAsync(cat);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<List<Category>> GetAll()
        {
            return await context.Categories
                        .Include(c => c.Products)
                            .ThenInclude(p => p.Ingredients)
                        .Include(c => c.Products)
                            .ThenInclude(p => p.Supplements)
                        .Include(c => c.Products)
                            .ThenInclude(p => p.Images)
                        .ToListAsync();
        }

        public async Task<Category> Get(int Id)
        {
            return await context.Categories
                        .Include(c => c.Products)
                            .ThenInclude(p => p.Ingredients)
                        .Include(c => c.Products)
                            .ThenInclude(p => p.Supplements)
                        .Include(c => c.Products)
                            .ThenInclude(p => p.Images)
                        .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<Category> GetByName(string Name)
        {
            return await context.Categories
                        .Include(c => c.Products)
                            .ThenInclude(p => p.Ingredients)
                        .Include(c => c.Products)
                            .ThenInclude(p => p.Supplements)
                        .Include(c => c.Products)
                            .ThenInclude(p => p.Images)
                        .FirstOrDefaultAsync(c => c.Name == Name);
        }

        public async Task<Category> Edit(Category cat)
        {
            context.Categories.Update(cat);
            await context.SaveChangesAsync();
            return cat;
        }
        public async Task Delete(int id)
        {
            var cat = await context.Categories.FindAsync(id);
            context.Categories.Remove(cat);
            await context.SaveChangesAsync();
        }
    }
}
