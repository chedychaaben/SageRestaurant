namespace Sage.Models
{
    public interface IImageRepository
    {
        Task<List<Image>> GetAll();

        Task<Image> Add(Image image);

        Task<Image> Get(int Id);
        Task<Image> GetByProductIdandImagePath(int ProductId, string ImagePath);

        Task<Image> Edit(Image image);

        Task Delete(int id);
    }
}
