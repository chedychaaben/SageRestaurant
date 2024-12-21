using System.ComponentModel.DataAnnotations;

namespace Sage.DTO
{
    public class AddProductOfTheDayDTO
    {
        [Required]
        public int ProductId { get; set; }
    }
}
