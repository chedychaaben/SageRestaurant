using System.ComponentModel.DataAnnotations;

public class ChangePasswordDTO
{
    [Required]
    [DataType(DataType.Password)]
    public string CurrentPassword { get; set; } // The user's current password

    [Required]
    [DataType(DataType.Password)]
    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    public string NewPassword { get; set; } // The new password to set
}
