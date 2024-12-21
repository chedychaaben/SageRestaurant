using System.ComponentModel.DataAnnotations;

namespace Sage.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        // Relationships
        public List<Product> Products { get; set; }
    }
}
