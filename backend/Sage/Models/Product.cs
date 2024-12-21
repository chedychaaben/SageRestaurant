using System.ComponentModel.DataAnnotations;

namespace Sage.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        [Required]
        public float Price { get; set; }
        public int DiscountRate { get; set; }
        public int PrepTime { get; set; }
        [Required]
        public int CategoryId { get; set; }
        // Relationships
        public List<Ingredient> Ingredients { get; set; }
        public List<Supplement> Supplements { get; set; }
        public List<Image> Images { get; set; }
    }
}
