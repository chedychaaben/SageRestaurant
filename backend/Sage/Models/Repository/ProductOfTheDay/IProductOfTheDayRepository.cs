namespace Sage.Models
{
    public interface IProductOfTheDayRepository
    {
        Task<List<ProductOfTheDay>> GetAll();

        Task<ProductOfTheDay> Add(ProductOfTheDay prod);

        Task<ProductOfTheDay> Get(int id);

        Task<ProductOfTheDay> GetByProductId(int ProductId);
        
        Task<ProductOfTheDay> Edit(ProductOfTheDay prod);

        Task Delete(int id);
    }
}
