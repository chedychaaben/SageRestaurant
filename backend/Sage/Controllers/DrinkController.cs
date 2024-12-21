using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sage.Models;
using Sage.DTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Sage.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DrinkController : ControllerBase
    {
        private readonly IDrinkRepository repo;

        public DrinkController(IDrinkRepository repository)
        {
            this.repo = repository;
        }

        [HttpPost("AddDrink")]
        public async Task<IActionResult> Add(
                [FromForm] AddDrinkDTO addDrinkDTO,
                [FromForm] IFormFileCollection images)
        {
            // Validate the incoming model (Drink entity)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Return all validation errors in the response
            }

            // Check if a Drink with the same name already exists
            var entityExist = await repo.GetByName(addDrinkDTO.Name);
            if (entityExist != null)
            {
                return BadRequest("Drink with the same name exists");
            }

            // Handle Image
            if (images.Count == 0)
            {
                return BadRequest("No image file provided.");
            }

            var firstImage = images[0]; // Access the image safely

            var uniqueFileName = $"{Guid.NewGuid()}_{firstImage.FileName}";

            // Define the path to save the file (local storage example)
            var filePath = Path.Combine("wwwroot/uploads", uniqueFileName);

            // Ensure the directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            // Save the file to the specified path
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await images[0].CopyToAsync(stream);
            }

            // Map addDrinkDTO to Entity
            var entity = new Drink
            {
                Name = addDrinkDTO.Name,
                Price = addDrinkDTO.Price,
                ImagePath = $"/uploads/{uniqueFileName}",
            };

            // Save the entity to the database
            var newDrink = await repo.Add(entity);

            // Return the newly created Drink with 201 Created status
            return CreatedAtAction(nameof(Get), new { Id = newDrink.Id }, newDrink);
        }

        [HttpGet("GetDrink/{Id:int}")]
        public async Task<IActionResult> Get(int Id)
        {
            return Ok(await repo.Get(Id));
        }

        [HttpGet("GetAllDrinks")]
        public async Task<IActionResult> GetAll()
        {
            List<Drink> Drinks
                = await repo.GetAll();

            return Ok(Drinks);
        }

        [HttpPut("EditDrink/{Id:int}")]
        public async Task<IActionResult> Edit(
                int Id,
                [FromForm] AddDrinkDTO addDrinkDTO,
                [FromForm] IFormFileCollection images)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingDrink = await repo.Get(Id);
            if (existingDrink == null)
            {
                return NotFound($"Drink with Id {Id} not found.");
            }

            // Check if a Drink with the same name already exists (excluding the current Drink)
            var entityExist = await repo.GetByName(addDrinkDTO.Name);
            if (entityExist != null && entityExist.Id != Id)
            {
                return BadRequest("A Drink with the same name already exists.");
            }


            // Handle Image
            if (images.Count == 0)
            {
                return BadRequest("No image file provided.");
            }

            var firstImage = images[0]; // Access the image safely

            var uniqueFileName = $"{Guid.NewGuid()}_{firstImage.FileName}";

            // Define the path to save the file (local storage example)
            var filePath = Path.Combine("wwwroot/uploads", uniqueFileName);

            // Ensure the directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            // Save the file to the specified path
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await images[0].CopyToAsync(stream);
            }

            // Update the fields
            existingDrink.Name = addDrinkDTO.Name;
            existingDrink.Price = addDrinkDTO.Price;
            existingDrink.ImagePath = $"/uploads/{uniqueFileName}";

            // Save the updated Drink
            var updatedDrink = await repo.Edit(existingDrink);

            return Ok(updatedDrink);
        }

        [HttpDelete("DeleteDrink/{Id:int}")]
        public async Task<IActionResult> Delete(int Id)
        {
            var existingDrink = await repo.Get(Id);
            if (existingDrink == null)
            {
                return NotFound();
            }
            await repo.Delete(Id);
            return Ok();
        }

    }
}