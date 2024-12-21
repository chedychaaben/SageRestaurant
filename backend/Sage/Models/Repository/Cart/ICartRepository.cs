namespace Sage.Models
{
    public interface ICartRepository
    {
        Task<Cart> Add(Cart cart);
        Task<Cart> Get(int Id);
        Task<Cart> GetByUserId(Guid UserId);
        Task<Cart> Edit(Cart cart);
        Task<Cart> SetToOrdered(int Id);
    }
}
