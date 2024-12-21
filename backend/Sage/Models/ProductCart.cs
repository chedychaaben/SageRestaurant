using System.ComponentModel.DataAnnotations;
using Sage.Models;

namespace Sage.Models
{
    public class ProductCart
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        public int CartId { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public float Price { get; set; }
        public int DiscountRate { get; set; }
        public int PrepTime { get; set; }
        [Required]
        public int Quantity { get; set; } = 1;
        [Required]
        public string ImagePath { get; set; }
        // Relationships
        public List<ProductCartIngredient> ProductCartIngredients { get; set; } = new List<ProductCartIngredient>();
        public List<ProductCartSupplement> ProductCartSupplements { get; set; } = new List<ProductCartSupplement>();

    }
}