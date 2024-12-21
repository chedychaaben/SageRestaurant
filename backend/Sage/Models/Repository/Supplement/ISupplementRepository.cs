namespace Sage.Models
{
    public interface ISupplementRepository
    {
        Task<List<Supplement>> GetAll();

        Task<Supplement> Add(Supplement supplement);

        Task<Supplement> Get(int id);

        Task<Supplement> GetByName(string Name);

        Task<Supplement> GetByProductIdandName(int ProductId, string Name);

        Task<Supplement> Edit(Supplement prod);

        Task Delete(int id);
        Task<List<Supplement>> GetByIds(IEnumerable<int> ListOfIds);
    }
}
