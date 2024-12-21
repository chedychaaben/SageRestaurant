using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sage.Models;
using Sage.DTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Sage.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ProductOfTheDayController : ControllerBase
    {
        private readonly IProductOfTheDayRepository repo;

        public ProductOfTheDayController(IProductOfTheDayRepository repository)
        {
            this.repo = repository;
        }
        [HttpPost("AddProductOfTheDay")]
        [Authorize]
        public async Task<IActionResult> Add(AddProductOfTheDayDTO addProductOfTheDayDTO)
        {
            // Validate the incoming model (ProductOfTheDay entity)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Return all validation errors in the response
            }

            // If he's not an admin then quit
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (requestUserRole != "Admin")
            {
                return Unauthorized("Only Admins are allowed.");
            }

            try
            {
                var entityExist = await repo.GetByProductId(addProductOfTheDayDTO.ProductId);
                if (entityExist != null)
                {
                    return BadRequest("Product already exists in products of the day!!");
                }

                // Map addcategoryDTO to Entity (Entity represents your database model)
                var entity = new ProductOfTheDay
                {
                    ProductId = addProductOfTheDayDTO.ProductId,
                    Date = DateTime.UtcNow
                };

                // Save the entity to the database
                var newEntity = await repo.Add(entity);

                // Return the newly created ProductOfTheDay with 201 Created status
                return CreatedAtAction(nameof(Get), new { Id = newEntity.Id }, newEntity);
            }
            catch (Exception ex)
            {
                // Log the exception (optional) and return a server error response
                // You can log the error to your logging system here
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetProductOfTheDay/{Id:int}")]
        public async Task<IActionResult> Get(int Id)
        {
            return Ok(await repo.Get(Id));
        }

        [HttpGet("GetAllProductOfTheDays")]
        public async Task<IActionResult> GetAll()
        {
            List<ProductOfTheDay> ProductOfTheDays
                = await repo.GetAll();

            return Ok(ProductOfTheDays);
        }

        [HttpPut("EditProductOfTheDay/{Id:int}")]
        [Authorize]
        public async Task<IActionResult> Edit(int Id, ProductOfTheDay entity)
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

            var existingProductOfTheDay = await repo.Get(Id);
            if (existingProductOfTheDay == null)
            {
                return NotFound($"Entity with Id {Id} not found.");
            }

            // Check if a ProductOfTheDay with the same name already exists (excluding the current ProductOfTheDay)
            var entityExist = await repo.Get(entity.Id);
            if (entityExist != null && entityExist.Id != Id)
            {
                return BadRequest("A ProductOfTheDay with the same Id already exists.");
            }

            // Update the fields
            existingProductOfTheDay.ProductId = entity.ProductId;
            existingProductOfTheDay.Date = entity.Date;

            // Save the updated ProductOfTheDay
            var updatedProductOfTheDay = await repo.Edit(existingProductOfTheDay);

            return Ok(updatedProductOfTheDay);
        }

        [HttpDelete("DeleteProductOfTheDay/{Id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int Id)
        {   
            // If he's not an admin then quit
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (requestUserRole != "Admin")
            {
                return Unauthorized("Only Admins are allowed.");
            }
            var existingProductOfTheDay = await repo.Get(Id);
            if (existingProductOfTheDay == null)
            {
                return NotFound();
            }
            await repo.Delete(Id);
            return Ok();
        }

    }
}