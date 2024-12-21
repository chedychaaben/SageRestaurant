using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Sage.DTO;
using Microsoft.AspNetCore.Mvc;
using Sage.Models;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Sage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DrinkCartController : ControllerBase
    {
        private readonly IDrinkCartRepository repo;
        private readonly IDrinkRepository drinkRepo;
        private readonly ICartRepository cartRepo;
        

        public DrinkCartController(IDrinkCartRepository repository, IDrinkRepository drinkRepo, ICartRepository cartRepo)
        {
            this.repo = repository;
            this.drinkRepo = drinkRepo;
            this.cartRepo = cartRepo;
        }



        [HttpPost("AddDrinkCart/{Id:int}")]
        [Authorize]
        public async Task<IActionResult> Add(int Id)
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
                return Unauthorized("Admins cannot add drinks to cart.");
            }

            if (!Guid.TryParse(requestUserId, out Guid parsedUserId))
            {
                return BadRequest("Invalid user ID format.");
            }

            var Cart = await cartRepo.GetByUserId(parsedUserId);
            if (Cart == null)
            {
                return NotFound($"Cart with userId {parsedUserId} not found.");
            }

            var Drink = await drinkRepo.Get(Id);
            if (Drink == null)
            {
                return NotFound($"Drink with Id {Id} not found.");
            }

            // Check if the DrinkCart already exists
            var existingDrinkCart = await repo.GetByDrinkandCart(Drink.Id, Cart.Id);
            if (existingDrinkCart != null)
            {

                // Increment the quantity if the DrinkCart already exists
                existingDrinkCart.Quantity += 1;
                await repo.Edit(existingDrinkCart);
                return Ok(existingDrinkCart);
            }

            // Create a new DrinkCart entity
            var entity = new DrinkCart
            {
                DrinkId = Drink.Id,
                CartId = Cart.Id,
                Name = Drink.Name,
                Price = Drink.Price,
                ImagePath = Drink.ImagePath,
                Quantity = 1
            };

            // Save the new DrinkCart entity
            var newDrinkCart = await repo.Add(entity);

            // Return the newly created ProductCart with a 201 Created status
            return CreatedAtAction(nameof(Get), new { Id = newDrinkCart.DrinkId}, newDrinkCart);
        }


        [HttpPut("AddQuantity/{Id:int}")]
        [Authorize]
        public async Task<IActionResult> AddQuantity(int Id)
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
                return Unauthorized("Admins cannot add product to cart.");
            }

            if (!Guid.TryParse(requestUserId, out Guid parsedUserId))
            {
                return BadRequest("Invalid user ID format.");
            }

            var Cart = await cartRepo.GetByUserId(parsedUserId);
            if (Cart == null)
            {
                return NotFound($"Cart with userId {parsedUserId} not found.");
            }

            var Drink = await drinkRepo.Get(Id);
            if (Drink == null)
            {
                return NotFound($"Drink with Id {Id} not found.");
            }

            // Check if the DrinkCart already exists
            var existingDrinkCart = await repo.GetByDrinkandCart(Drink.Id, Cart.Id);
            if (existingDrinkCart == null)
            {
                return NotFound("DrinkCart Not Found");
            }

            // Decrement the quantity
            existingDrinkCart.Quantity += 1;

            // Otherwise, update the entity with the decremented quantity
            await repo.Edit(existingDrinkCart);
            return Ok(existingDrinkCart);
        }


        [HttpPut("RemoveQuantity/{Id:int}")]
        [Authorize]
        public async Task<IActionResult> RemoveQuantity(int Id)
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
                return Unauthorized("Admins cannot add product to cart.");
            }

            if (!Guid.TryParse(requestUserId, out Guid parsedUserId))
            {
                return BadRequest("Invalid user ID format.");
            }

            var Cart = await cartRepo.GetByUserId(parsedUserId);
            if (Cart == null)
            {
                return NotFound($"Cart with userId {parsedUserId} not found.");
            }

            var Drink = await drinkRepo.Get(Id);
            if (Drink == null)
            {
                return NotFound($"Drink with Id {Id} not found.");
            }

            // Check if the DrinkCart already exists
            var existingDrinkCart = await repo.GetByDrinkandCart(Drink.Id, Cart.Id);
            if (existingDrinkCart == null)
            {
                return NotFound("DrinkCart Not Found");
            }

            // Decrement the quantity
            existingDrinkCart.Quantity -= 1;

            if (existingDrinkCart.Quantity <= 0)
            {
                // If quantity is zero or less, delete the entity
                await repo.Delete(existingDrinkCart);
                return Ok("DrinkCart Deleted");
            }
            else
            {
                // Otherwise, update the entity with the decremented quantity
                await repo.Edit(existingDrinkCart);
                return Ok(existingDrinkCart);
            }
        }

        [HttpGet("GetDrinkCart/{Id:int}")]
        public async Task<IActionResult> Get(int Id)
        {
            var drinkCart = await repo.Get(Id);
            if (drinkCart == null)
            {
                return NotFound();
            }

            return Ok(drinkCart);
        }

    }
}
