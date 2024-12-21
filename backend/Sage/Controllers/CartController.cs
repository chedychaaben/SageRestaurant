using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sage.DTO;
using Sage.Models;

namespace Sage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository repo;

        public CartController(ICartRepository repository)
        {
            this.repo = repository;
        }

        [HttpPost("AddCart")]
        [Authorize]
        public async Task<IActionResult> Add()
        {
            // Make sure the access is allowed
            var requestUserId = User.FindFirst("userId")?.Value;

            // If he's an admin then quit
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (requestUserRole == "Admin")
            {
                return Unauthorized("Admins cannot create carts.");
            }

            if (!Guid.TryParse(requestUserId, out Guid parsedUserId))
            {
                return BadRequest("Invalid user ID format.");
            }

            var entity = new Cart
            {
                UserId = parsedUserId
            };

            // Check if the user already has an active cart
            var existingCart = await repo.GetByUserId(parsedUserId);
            if (existingCart != null)
            {
                return Conflict("User already has an active cart.");
            }

            // Save the entity to the database
            var newCart = await repo.Add(entity);

            // Return the newly created product with 201 Created status
            return CreatedAtAction(nameof(Get), new { Id = newCart.Id }, newCart);
        }

        [HttpGet("GetCart")]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            // Make sure the access is allowed
            var requestUserId = User.FindFirst("userId")?.Value;

            // If he's an admin then quit
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (requestUserRole == "Admin")
            {
                return Unauthorized("Admins cannot create carts.");
            }

            if (!Guid.TryParse(requestUserId, out Guid parsedUserId))
            {
                return BadRequest("Invalid user ID format.");
            }
            return Ok(await repo.GetByUserId(parsedUserId));
        }



        [HttpPut("EditCart")]
        [Authorize]
        public async Task<IActionResult> Edit(Cart cart)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            // Make sure the access is allowed
            var requestUserId = User.FindFirst("userId")?.Value;

            // If he's an admin then quit
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (requestUserRole == "Admin")
            {
                return Unauthorized("Admins cannot create carts.");
            }

            if (!Guid.TryParse(requestUserId, out Guid parsedUserId))
            {
                return BadRequest("Invalid user ID format.");
            }

            var existingCart = await repo.GetByUserId(parsedUserId);
            if (existingCart == null)
            {
                return NotFound($"Cart with userId {parsedUserId} not found.");
            }


            // Update the fields
            existingCart.Id = cart.Id;
            existingCart.UserId = cart.UserId;
            existingCart.ProductCarts = cart.ProductCarts;

            // Save the updated product
            var updatedCart = await repo.Edit(existingCart);

            return Ok(updatedCart);
        }

    }
}
