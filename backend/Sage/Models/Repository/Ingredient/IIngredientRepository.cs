namespace Sage.Models
{
    public interface IIngredientRepository
    {
        Task<List<Ingredient>> GetAll();

        Task<Ingredient> Add(Ingredient ingredient);

        Task<Ingredient> Get(int Id);

        Task<Ingredient> GetByName(string Name);

        Task<Ingredient> GetByProductIdandName(int ProductId, string Name);

        Task<Ingredient> Edit(Ingredient ingredient);

        Task Delete(int id);
        Task<List<Ingredient>> GetByIds(IEnumerable<int> ListOfIds);
    }
}
