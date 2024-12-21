using Microsoft.EntityFrameworkCore;
namespace Sage.Models
{
    public class ImageRepository : IImageRepository
    {
        private readonly AppDbContext context;
        public ImageRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<Image> Add(Image image)
        {
            var result = await context.Images.AddAsync(image);
            await context.SaveChangesAsync();
            return result.Entity;
        }


        public async Task<List<Image>> GetAll()
        {
            List<Image> Images = await context.Images.ToListAsync();
            return Images;
        }

        public async Task<Image> Get(int Id)
        {
            return await context.Images.FirstOrDefaultAsync(r => r.Id == Id);
        }

        public async Task<Image> GetByProductIdandImagePath(int ProductId, string ImagePath)
        {
            return await context.Images.FirstOrDefaultAsync(i => i.ImagePath == ImagePath && i.ProductId == ProductId);
        }

        public async Task<Image> Edit(Image image)
        {
            context.Images.Update(image);
            await context.SaveChangesAsync();
            return image;
        }
        public async Task Delete(int id)
        {
            var image = await context.Images.FindAsync(id);
            context.Images.Remove(image);
            await context.SaveChangesAsync();
        }

    }
}