using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Sage.DTO
{
    public class AddProductCartDTO
    {
        [Required]
        public int ProductId { get; set; } // The ID of the main product

        [Required]
        [DefaultValue(1)]
        public int Quantity { get; set; }

        [Required]
        public List<int> IngredientIds { get; set; } // List of ingredient IDs

        [Required]
        public List<int> SupplementIds { get; set; } // List of supplement IDs
    }
}
