using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sage.Models;
using Sage.DTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
namespace Sage.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository repo;
        private readonly ICartRepository cartRepo;

        public OrderController(IOrderRepository repository, ICartRepository cartRepo)
        {
            this.repo = repository;
            this.cartRepo = cartRepo;
        }

        [Authorize]
        [HttpPost("AddOrder")]
        public async Task<IActionResult> Add(AddOrderDTO addOrderDTO)
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
                return Unauthorized("Admins cannot place orders.");
            }

            if (!Guid.TryParse(requestUserId, out Guid parsedUserId))
            {
                return BadRequest("Invalid user ID format.");
            }

            // Retrieve the cart by user ID
            Cart existingCart = await cartRepo.GetByUserId(parsedUserId);

            // Check if the user already has an active cart
            if (existingCart == null)
            {
                return Conflict("You must have a cart before placing an order.");
            }

            // Check if the user already has an active cart
            if (existingCart.IsOrdered == true)
            {
                return Conflict("Your order has been already placed.");
            }

            // Check if the cart has products
            if (existingCart.ProductCarts == null || existingCart.ProductCarts.Count == 0)
            {
                return Conflict("Your Cart is empty, go choose items.");
            }


            // Initialize total
            float total = 0;

            // Calculate the total from the cart's products
            foreach (var productCart in existingCart.ProductCarts)
            {
                // Calculate product total with quantity and discount
                float productTotal = productCart.Price * productCart.Quantity;
                float discount = (productCart.DiscountRate / 100f) * productTotal;
                productTotal -= discount;

                total += productTotal;

                // Add supplements to the product total
                foreach (var productCartSupplement in productCart.ProductCartSupplements)
                {
                    total += productCartSupplement.Price * productCart.Quantity; // Multiply supplement price by product quantity
                }
            }

            // Calculate the total from the cart's drinks
            foreach (var drinkCart in existingCart.DrinkCarts)
            {
                // Multiply drink price by quantity
                total += drinkCart.Price * drinkCart.Quantity;
            }

            // Map addOrderDTO to the Order entity
            var entity = new Order
            {
                UserId = parsedUserId,
                CartId = existingCart.Id,
                Date = DateTime.UtcNow,
                Total = total,
                Message = addOrderDTO.Message,
                Delivered = false
            };

            // Save the entity to the database
            var newOrder = await repo.Add(entity);

            // Change the cart status to Ordered
            await cartRepo.SetToOrdered(existingCart.Id);

            // Return the newly created order with a 201 Created status
            return CreatedAtAction(nameof(Get), new { Id = newOrder.Id }, newOrder);
        }

        [HttpGet("GetOrder/{Id:int}")]
        public async Task<IActionResult> Get(int Id)
        {
            return Ok(await repo.Get(Id));
        }


        [HttpGet("GetUserOrders")]
        [Authorize]
        public async Task<IActionResult> GetUserOrders()
        {
            // Ensure the user is authenticated and has the correct access
            var requestUserId = User.FindFirst("userId")?.Value;

            if (!Guid.TryParse(requestUserId, out Guid parsedUserId))
            {
                return BadRequest("Invalid user ID format.");
            }
            return Ok(await repo.GetOrdersForUser(parsedUserId));
        }


        [HttpGet("GetAllOrders")]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            // If he's not an admin then quit
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (requestUserRole != "Admin")
            {
                return Unauthorized("Only Admins are allowed.");
            }

            List<Order> Orders
                = await repo.GetAll();

            return Ok(Orders);
        }

        [HttpPut("EditOrder/{Id:int}")]
        [Authorize]
        public async Task<IActionResult> Edit(int Id, Order entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // If he's not an admin then quit
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (requestUserRole != "Admin")
            {
                return Unauthorized("Only Admins are allowed.");
            }

            var existingOrder = await repo.Get(Id);
            if (existingOrder == null)
            {
                return NotFound($"Order with Id {Id} not found.");
            }

            // Update the fields
            existingOrder.UserId = entity.UserId;
            existingOrder.CartId = entity.CartId;
            existingOrder.Date = entity.Date;
            existingOrder.Total = entity.Total;
            existingOrder.Message = entity.Message;

            // Save the updated Order
            var updatedOrder = await repo.Edit(existingOrder);

            return Ok(updatedOrder);
        }

        [HttpDelete("DeleteOrder/{Id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int Id)
        {
            // If he's not an admin then quit
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (requestUserRole != "Admin")
            {
                return Unauthorized("Only Admins are allowed.");
            }
            var existingOrder = await repo.Get(Id);
            if (existingOrder == null)
            {
                return NotFound();
            }
            await repo.Delete(Id);
            return Ok();
        }



        [HttpPut("Deliver/{Id:int}")]
        [Authorize]
        public async Task<IActionResult> Deliver(int Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Make sure the access is allowed
            var requestUserId = User.FindFirst("userId")?.Value;

            // If he's an admin then quit
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (requestUserRole != "Admin")
            {
                return Unauthorized("Only Admins can accept an order.");
            }

            var existingOrder = await repo.Get(Id);

            if (existingOrder == null)
            {
                return NotFound($"Order with Id {Id} not found.");
            }

            // Update the fields
            existingOrder.Delivered = true;

            // Save the updated Order
            var updatedOrder = await repo.Edit(existingOrder);

            return Ok(updatedOrder);
        }
    }
}