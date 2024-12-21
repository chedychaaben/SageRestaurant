using Microsoft.EntityFrameworkCore;
namespace Sage.Models
{
    public class SupplementRepository : ISupplementRepository
    {
        private readonly AppDbContext context;
        public SupplementRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<Supplement> Add(Supplement supplement)
        {
            var result = await context.Supplements.AddAsync(supplement);
            await context.SaveChangesAsync();
            return result.Entity;
        }


        public async Task<List<Supplement>> GetAll()
        {
            List<Supplement> Supplements = await context.Supplements.ToListAsync();
            return Supplements;
        }

        public async Task<Supplement> Get(int Id)
        {
            return await context.Supplements.FirstOrDefaultAsync(p => p.Id == Id);
        }

        public async Task<Supplement> GetByName(string Name)
        {
            return await context.Supplements.FirstOrDefaultAsync(p => p.Name == Name);
        }

        public async Task<Supplement> GetByProductIdandName(int ProductId, string Name)
        {
            return await context.Supplements.FirstOrDefaultAsync(s => s.Name == Name && s.ProductId == ProductId);
        }

        public async Task<Supplement> Edit(Supplement prod)
        {
            context.Supplements.Update(prod);
            await context.SaveChangesAsync();
            return prod;
        }
        public async Task Delete(int id)
        {
            var prod = await context.Supplements.FindAsync(id);
            context.Supplements.Remove(prod);
            await context.SaveChangesAsync();
        }


        public async Task<List<Supplement>> GetByIds(IEnumerable<int> ListOfIds)
        {
            return await context.Supplements
                .Where(i => ListOfIds.Contains(i.Id))
                .ToListAsync();
        }
    }
}
