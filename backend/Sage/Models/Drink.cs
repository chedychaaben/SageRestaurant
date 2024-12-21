using System.ComponentModel.DataAnnotations;

namespace Sage.Models
{
    public class Drink
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public float Price { get; set; }

        [Required]
        public string ImagePath { get; set; }
    }
}