using System.ComponentModel.DataAnnotations;

public class ChangeFullNameDTO
{
    [Required]
    [StringLength(100, ErrorMessage = "The full name cannot exceed 100 characters.")]
    public string NewFullName { get; set; } // The new full name of the user
}
