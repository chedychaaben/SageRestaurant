using System;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace Sage.Attributes
{
    public class PasswordComplexityAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            var password = value as string;
            /*
            if (string.IsNullOrWhiteSpace(password))
                return false;

            if (password.Length < 6)
                return false;

            if (!password.Any(char.IsUpper)) 
                return false;

            if (!password.Any(char.IsDigit)) 
                return false;
            */
            return true;
        }

        public override string FormatErrorMessage(string name)
        {
            return "Password must be at least 6 characters long, contain at least one uppercase letter, and one digit.";
        }
    }
}
