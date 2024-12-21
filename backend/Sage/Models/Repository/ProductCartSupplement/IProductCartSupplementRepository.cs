namespace Sage.Models
{
    public interface IProductCartSupplementRepository
    {
        Task<List<ProductCartSupplement>> GetAll();

        Task<ProductCartSupplement> Add(ProductCartSupplement productcartsupplement);

        Task<ProductCartSupplement> Get(int id);

        Task<ProductCartSupplement> GetByName(string nom);

        Task<ProductCartSupplement> Edit(ProductCartSupplement productcartsupplement);

        Task Delete(int id);
        Task<List<ProductCartSupplement>> GetByIds(IEnumerable<int> ListOfIds);
    }
}
