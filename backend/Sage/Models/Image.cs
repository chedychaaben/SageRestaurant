using System.ComponentModel.DataAnnotations;

namespace Sage.Models
{
    public class Image
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        public string ImagePath { get; set; }
    }
}