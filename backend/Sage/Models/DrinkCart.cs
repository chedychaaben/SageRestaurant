using System.ComponentModel.DataAnnotations;

namespace Sage.Models
{
    public class DrinkCart
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int CartId { get; set; }
        [Required]
        public int DrinkId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public float Price { get; set; }
        [Required]
        public string ImagePath { get; set; }
        [Required]
        public int Quantity { get; set; }

    }
}