using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sage.Models
{
    public class DrinkRepository : IDrinkRepository
    {
        private readonly AppDbContext context;

        public DrinkRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<Drink> Add(Drink drink)
        {
            var result = await context.Drinks.AddAsync(drink);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<List<Drink>> GetAll()
        {
            return await context.Drinks.ToListAsync();
        }

        public async Task<Drink> Get(int id)
        {
            return await context.Drinks.FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Drink> GetByName(string Name)
        {
            return await context.Drinks.FirstOrDefaultAsync(d => d.Name == Name);
        }

        public async Task<Drink> Edit(Drink entity)
        {
            context.Drinks.Update(entity);
            await context.SaveChangesAsync();
            return entity;
        }

        public async Task Delete(int id)
        {
            var entity = await context.Drinks.FindAsync(id);
            if (entity != null)
            {
                context.Drinks.Remove(entity);
                await context.SaveChangesAsync();
            }
        }
    }
}
