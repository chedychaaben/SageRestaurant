using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Sage.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; } // Added as an optional field
    }
}