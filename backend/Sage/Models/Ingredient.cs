using System.ComponentModel.DataAnnotations;

namespace Sage.Models
{
    public class Ingredient
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }

        [Required]
        public string Name { get; set; }

    }
}