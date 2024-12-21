namespace Sage.Models
{
    public interface IProductCartIngredientRepository
    {
        Task<List<ProductCartIngredient>> GetAll();

        Task<ProductCartIngredient> Add(ProductCartIngredient productcartingredient);

        Task<ProductCartIngredient> Get(int id);

        Task<ProductCartIngredient> GetByName(string nom);

        Task<ProductCartIngredient> Edit(ProductCartIngredient prod);

        Task Delete(int id);
        Task<List<ProductCartIngredient>> GetByIds(IEnumerable<int> ListOfIds);
    }
}
