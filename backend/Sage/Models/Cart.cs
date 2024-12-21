using System.ComponentModel.DataAnnotations;

namespace Sage.Models
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public bool IsOrdered { get; set; } = false;

        // Relationships
        public List<ProductCart> ProductCarts { get; set; }
        public List<DrinkCart> DrinkCarts { get; set; }
    }
}
