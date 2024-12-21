using System.ComponentModel.DataAnnotations;

namespace Sage.Models
{
    public class ProductCartIngredient
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductCartId { get; set; }

        [Required]
        public string Name { get; set; }

    }
}