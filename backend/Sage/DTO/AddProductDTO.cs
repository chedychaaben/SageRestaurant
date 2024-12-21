using System.ComponentModel.DataAnnotations;

namespace Sage.DTO
{
    public class AddProductDTO
    {
        [Required]
        public string Name { get; set; } // The name of the product

        public string? Description { get; set; }

        [Required]
        public float Price { get; set; } // Price of the product

        public int DiscountRate { get; set; } // Discount rate of the product

        public int PrepTime { get; set; } // Preparation time of the product

        [Required]
        public int CategoryId { get; set; } // Category ID of the product
        public List<IngredientDTO> Ingredients { get; set; }
        public List<SupplementDTO> Supplements { get; set; }
    }


    public class IngredientDTO
    {
        [Required]
        public string Name { get; set; } // Ingredient name or ID
    }
    public class SupplementDTO
    {
        [Required]
        public string Name { get; set; } // Supplement name or ID

        [Required]
        [Range(0.01, float.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public float Price { get; set; } // Supplement price
    }

}