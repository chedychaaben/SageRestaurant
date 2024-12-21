using System.ComponentModel.DataAnnotations;

namespace Sage.DTO
{
    public class AddDrinkDTO
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public float Price { get; set; }
    }
}
