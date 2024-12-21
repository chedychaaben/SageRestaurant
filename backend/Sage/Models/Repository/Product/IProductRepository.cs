namespace Sage.Models
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAll();

        Task<Product> Add(Product prod);

        Task<Product> Get(int id);

        Task<Product> GetByName(string nom);

        Task<Product> Edit(Product prod);

        Task Delete(int id);
    }
}
