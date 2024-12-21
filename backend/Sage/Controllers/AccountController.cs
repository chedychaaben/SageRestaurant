using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Sage.Models;
using Sage.DTO;
using System.Data;
using Microsoft.AspNetCore.Authorization;



namespace Sage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration configuration;

        public AccountController(UserManager<ApplicationUser> userManager,
            IConfiguration configuration)
        {
            this.userManager = userManager;
            this.configuration = configuration;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDTO register)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Create a new ApplicationUser, setting Email and UserName to the same value
            var user = new ApplicationUser
            {
                Email = register.Email,
                UserName = register.Email // Automatically set UserName to match Email
            };

            // Create the user
            var result = await userManager.CreateAsync(user, register.Password);
            if (result.Succeeded)
            {
                return Ok("User registered successfully.");
            }

            // Return any errors that occurred during creation
            return BadRequest(result.Errors);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDTO login)
        {
            // Validate the model state
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the user by email
            var user = await userManager.FindByEmailAsync(login.Email);
            if (user == null)
            {
                return Unauthorized("Incorrect email or password");
            }

            // Check if the password is correct
            if (await userManager.CheckPasswordAsync(user, login.Password))
            {
                // Get roles for the user
                var roles = await userManager.GetRolesAsync(user);

                // Define the claims to include in the JWT
                var claims = new List<Claim>
        {
            new Claim("email", user.Email), // Use email as the unique identifier
            new Claim("userId", user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Unique JWT ID
        };

                // Add each role as a claim
                foreach (var role in roles)
                {
                    claims.Add(new Claim("role", role)); // Add each role individually
                }

                // Signing the JWT Token
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"]));
                var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    claims: claims,
                    issuer: configuration["JWT:Issuer"],
                    audience: configuration["JWT:Audience"],
                    expires: DateTime.UtcNow.AddHours(1),
                    signingCredentials: signingCredentials
                );

                // Return the token and expiration time
                var _token = new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    email = login.Email
                };

                return Ok(_token); // Return token to the client
            }

            // If password is incorrect
            return Unauthorized("Incorrect email or password");
        }


        [HttpPost("ChangePassword")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordDTO changePasswordDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Ensure the requesting user is an admin
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (requestUserRole == "Admin")
            {
                return Unauthorized("Admins cannot edit their passwords.");
            }

            // Retrieve the user ID from the claims (assuming user ID is stored in the claim)
            var requestUserId = User.FindFirst("userId")?.Value;

            if (requestUserId == null)
            {
                return BadRequest("User ID not found.");
            }

            // Fetch the user by their ID
            var user = await userManager.FindByIdAsync(requestUserId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Attempt to change the password
            var result = await userManager.ChangePasswordAsync(user, changePasswordDTO.CurrentPassword, changePasswordDTO.NewPassword);
            if (result.Succeeded)
            {
                return Ok("Password changed successfully.");
            }

            // Handle errors
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return BadRequest(ModelState);
        }


        [HttpPost("ChangeFullName")]
        [Authorize]
        public async Task<IActionResult> ChangeFullName(ChangeFullNameDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Make sure the access is allowed
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var requestUserId = User.FindFirst("userId")?.Value;

            if (requestUserId == null)
            {
                return BadRequest("User ID not found.");
            }

            // Fetch the user by their ID
            var user = await userManager.FindByIdAsync(requestUserId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (requestUserId != user.Id)
            {
                return Unauthorized("Only the user himself can edit his fullname.");
            }


            // Update the user's full name
            user.FullName = model.NewFullName;
            var result = await userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok("Full name updated successfully.");
            }

            // Handle errors
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return BadRequest(ModelState);
        }

        [HttpGet("GetUsers")]
        [Authorize]
        public async Task<IActionResult> GetUsers()
        {
            // Ensure the requesting user is an admin
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (requestUserRole != "Admin")
            {
                return Unauthorized("Only Admins are permitted to access this resource.");
            }

            var users = userManager.Users.ToList();
            var nonAdminUsers = new List<object>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                if (!roles.Contains("Admin"))
                {
                    nonAdminUsers.Add(new
                    {
                        user.Id,
                        user.Email,
                        user.FullName,
                        user.UserName
                    });
                }
            }

            return Ok(nonAdminUsers);
        }


        [HttpGet("GetUser")]
        [Authorize]
        public async Task<IActionResult> GetUser()
        {
            // Ensure the requesting user is an admin
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (requestUserRole == "Admin")
            {
                return Unauthorized("Admins cannot edit their profiles.");
            }

            // Retrieve the user ID from the claims (assuming user ID is stored in the claim)
            var requestUserId = User.FindFirst("userId")?.Value;

            if (requestUserId == null)
            {
                return BadRequest("User ID not found.");
            }

            // Fetch the user by their ID
            var user = await userManager.FindByIdAsync(requestUserId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user);

        }

    }
}
