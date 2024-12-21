namespace Sage.Models
{
    public interface IDrinkRepository
    {
        Task<List<Drink>> GetAll();

        Task<Drink> Add(Drink drink);

        Task<Drink> Get(int Id);

        Task<Drink> GetByName(string name);

        Task<Drink> Edit(Drink drink);

        Task Delete(int Id);
    }
}
