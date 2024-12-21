using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sage.DTO;
using Sage.Models;
using System.Security.Claims;

namespace Sage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {

        private readonly ICategoryRepository repo;

        public CategoryController(ICategoryRepository repository)
        {
            this.repo = repository;
        }

        [HttpPost("AddCategory")]
        [Authorize]
        public async Task<IActionResult> Add(AddCategoryDTO addcategoryDTO)
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

            // Check if a category with the same nom already exists
            var catExist = await repo.GetByName(addcategoryDTO.Name);
            if (catExist != null)
            {
                return BadRequest("Category avec le même nom existe !!");
            }

            // Map addcategoryDTO to Entity (Entity represents your database model)
            var entity = new Category
            {
                Name = addcategoryDTO.Name,
                Description = addcategoryDTO.Description,
                Products = new List<Product>() // Initialize the Products collection as an empty list
            };

            // Save the entity to the database
            var newCat = await repo.Add(entity);

            // Return the newly created product with 201 Created status
            return CreatedAtAction(nameof(Get), new { Id = newCat.Id }, newCat);
        }

        [HttpGet("GetCategory/{Id:int}")]
        public async Task<IActionResult> Get(int Id)
        {
            return Ok(await repo.Get(Id));
        }

        [HttpGet("GetAllCategories")]
        public async Task<IActionResult> GetAll()
        {
            List<Category> Categories
                = await repo.GetAll();

            return Ok(Categories);
        }


        [HttpPut("EditCategory/{Id:int}")]
        [Authorize]
        public async Task<IActionResult> Edit(int Id, Category category)
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
            var existingCategory = await repo.Get(Id);
            if (existingCategory == null)
            {
                return NotFound($"Category with Id {Id} not found.");
            }

            // Check if a Category with the same name already exists (excluding the current Category)
            var catExist = await repo.GetByName(category.Name);
            if (catExist != null && catExist.Id != Id)
            {
                return BadRequest("A Category with the same name already exists.");
            }

            // Update the fields
            existingCategory.Name = category.Name;
            existingCategory.Description = category.Description;

            // Save the updated Category
            var updatedCategory = await repo.Edit(existingCategory);

            return Ok(updatedCategory);
        }

        [HttpDelete("DeleteCategory/{Id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int Id)
        {
            // If he's not an admin then quit
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (requestUserRole != "Admin")
            {
                return Unauthorized("Only Admins are allowed.");
            }
            var existingCategory = await repo.Get(Id);
            if (existingCategory == null)
            {
                return NotFound();
            }
            await repo.Delete(Id);
            return Ok();
        }
    }
}
