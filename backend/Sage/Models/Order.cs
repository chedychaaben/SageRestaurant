using System.ComponentModel.DataAnnotations;

namespace Sage.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public int CartId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public float Total { get; set; }

        public string Message { get; set; }

        [Required]
        public bool Delivered { get; set; }  = false;
        public Cart Cart { get; set; } // Navigation property to Cart

    }
}
