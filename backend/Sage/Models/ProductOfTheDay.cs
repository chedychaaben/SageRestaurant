using System.ComponentModel.DataAnnotations;

namespace Sage.Models
{
    public class ProductOfTheDay
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        public DateTime Date { get; set; }
    }
}
