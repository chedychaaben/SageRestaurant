using System.ComponentModel.DataAnnotations;

namespace Sage.Models
{
    public class Supplement
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }

        [Required]
        public string Name { get; set; }
        
        [Required]
        public float Price { get; set; }

    }
}