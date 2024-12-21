using System.ComponentModel.DataAnnotations;

namespace Sage.DTO
{
    public class AddCategoryDTO
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
