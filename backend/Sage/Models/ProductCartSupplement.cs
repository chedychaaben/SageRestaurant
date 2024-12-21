using System.ComponentModel.DataAnnotations;

namespace Sage.Models
{
    public class ProductCartSupplement
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductCartId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public float Price { get; set; }

    }
}