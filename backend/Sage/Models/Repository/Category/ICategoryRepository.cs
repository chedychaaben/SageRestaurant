namespace Sage.Models
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAll();

        Task<Category> Add(Category cat);

        Task<Category> Get(int id);

        Task<Category> GetByName(string nom);

        Task<Category> Edit(Category cat);

        Task Delete(int id);
    }
}
