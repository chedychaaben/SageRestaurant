namespace Sage.Models
{
    public interface IDrinkCartRepository
    {
        Task<DrinkCart> Add(DrinkCart DrinkCart);
        Task<DrinkCart> Get(int Id);
        Task<DrinkCart> GetByDrinkandCart(int DrinkId, int CartId);
        Task<DrinkCart> AddQuantity(int Id);
        Task<DrinkCart> RemoveQuantity(int Id);
        Task Edit(DrinkCart DrinkCart);
        Task Delete(DrinkCart DrinkCart);
    }
}
