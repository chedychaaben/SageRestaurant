namespace Sage.Models
{
    public interface IProductCartRepository
    {
        Task<ProductCart> Add(ProductCart ProductCart);
        Task<ProductCart> Get(int ProductId, int CartId);
        Task<ProductCart> AddQuantity(int ProductId, int CartId);
        Task<ProductCart> RemoveQuantity(int ProductId, int CartId);
        Task Edit(ProductCart ProductCart);
        Task Delete(ProductCart ProductCart);
    }
}
