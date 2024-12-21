namespace Sage.Models
{
    public interface IOrderRepository
    {
        Task<List<Order>> GetAll();

        Task<Order> Add(Order order);

        Task<Order> Get(int Id);

        Task<List<Order>> GetOrdersForUser(Guid userId);
        
        Task<Order> Edit(Order order);

        Task Delete(int Id);
    }
}
