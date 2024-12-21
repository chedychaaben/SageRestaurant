using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sage.Models;
using Sage.DTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Newtonsoft.Json;
using System.Linq;

namespace Sage.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository repo;

        private readonly ICategoryRepository categoryrepo;

        private readonly IIngredientRepository ingredientrepo;

        private readonly ISupplementRepository supplementrepo;

        private readonly IImageRepository imagerepo;


        public ProductController(IProductRepository repository, ICategoryRepository categoryrepo, IIngredientRepository ingredientrepo, ISupplementRepository supplementrepo, IImageRepository imagerepo)
        {
            this.repo = repository;
            this.categoryrepo = categoryrepo;
            this.ingredientrepo = ingredientrepo;
            this.supplementrepo = supplementrepo;
            this.imagerepo = imagerepo;
        }

        [HttpPost("AddProduct")]
        [Authorize]
        public async Task<IActionResult> Add(
                [FromForm] AddProductDTO addProductDTO,
                [FromForm] string ingredients,
                [FromForm] string supplements,
                [FromForm] IFormFileCollection images)
        {
            // Deserialize the ingredients and supplements JSON strings
            var ingredientList = JsonConvert.DeserializeObject<List<IngredientDTO>>(ingredients);
            var supplementList = JsonConvert.DeserializeObject<List<SupplementDTO>>(supplements);

            // Now the ingredients and supplements are deserialized into lists
            addProductDTO.Ingredients = ingredientList;
            addProductDTO.Supplements = supplementList;

            // Validate the incoming model (Product entity)
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

            var imagePaths = new List<string>();

            // Handle file processing (example logic)
            foreach (var image in images)
            {
                if (image.Length > 0)
                {
                    // Generate a unique file name
                    var uniqueFileName = $"{Guid.NewGuid()}_{image.FileName}";

                    // Define the path to save the file (local storage example)
                    var filePath = Path.Combine("wwwroot/uploads", uniqueFileName);

                    // Ensure the directory exists
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                    // Save the file to the specified path
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    // Save the relative path or URL to the image list
                    imagePaths.Add($"/uploads/{uniqueFileName}");
                }
            }

            // Check if a product with the same name already exists
            var prodExist = await repo.GetByName(addProductDTO.Name);
            if (prodExist != null)
            {
                return BadRequest("Produit with the same name exists !!");
            }

            // Check if the category exists
            var catExist = await categoryrepo.Get(addProductDTO.CategoryId);
            if (catExist == null)
            {
                return BadRequest($"Category with {addProductDTO.CategoryId} not found.");
            }

            // Map addProductDTO to Entity
            var entity = new Product
            {
                Name = addProductDTO.Name,
                Description = addProductDTO.Description,
                Price = addProductDTO.Price,
                DiscountRate = addProductDTO.DiscountRate,
                PrepTime = addProductDTO.PrepTime,
                CategoryId = addProductDTO.CategoryId,
                Images = new List<Image>(),
                Ingredients = new List<Ingredient>(),
                Supplements = new List<Supplement>()
            };

            // Save the entity to the database
            var newProd = await repo.Add(entity);



            // Create Ingredients
            List<Ingredient> new_ingredients = new List<Ingredient>();
            foreach (var ingredient in addProductDTO.Ingredients)
            {
                var entityIngredient = new Ingredient
                {
                    ProductId = newProd.Id,
                    Name = ingredient.Name
                };

                await ingredientrepo.Add(entityIngredient);
            }

            // Create Supplements
            List<Supplement> new_supplements = new List<Supplement>();
            foreach (var supplement in addProductDTO.Supplements)
            {
                var entitySupplement = new Supplement
                {
                    ProductId = newProd.Id,
                    Name = supplement.Name,
                    Price = supplement.Price
                };
                await supplementrepo.Add(entitySupplement);
            }

            // Create Images
            foreach (var image in imagePaths)
            {
                var entityImage = new Image
                {
                    ProductId = newProd.Id,
                    ImagePath = image
                };
                await imagerepo.Add(entityImage);
            }
            // Return the newly created product with 201 Created status
            return CreatedAtAction(nameof(Get), new { Id = newProd.Id }, newProd);
            
        }

        [HttpGet("GetProduct/{Id:int}")]
        public async Task<IActionResult> Get(int Id)
        {
            return Ok(await repo.Get(Id));
        }

        [HttpGet("GetAllProducts")]
        public async Task<IActionResult> GetAll()
        {
            List<Product> products
                = await repo.GetAll();

            return Ok(products);
        }

        [HttpGet("GetProductsByCategory/{CategoryId:int}")]
        public async Task<IActionResult> GetByCategory(int CategoryId)
        {
            return Ok(await repo.Get(CategoryId));
        }


        [HttpPut("EditProduct/{Id:int}")]
        [Authorize]
        public async Task<IActionResult> Edit(
                int Id,
                [FromForm] AddProductDTO addProductDTO,
                [FromForm] string ingredients,
                [FromForm] string supplements,
                [FromForm] IFormFileCollection images)
        {
            // Deserialize the ingredients and supplements JSON strings
            var ingredientList = JsonConvert.DeserializeObject<List<IngredientDTO>>(ingredients);
            var supplementList = JsonConvert.DeserializeObject<List<SupplementDTO>>(supplements);

            // Now the ingredients and supplements are deserialized into lists
            addProductDTO.Ingredients = ingredientList;
            addProductDTO.Supplements = supplementList;

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

            var existingProduct = await repo.Get(Id);
            if (existingProduct == null)
            {
                return NotFound($"Product with Id {Id} not found.");
            }

            // Check if a product with the same name already exists (excluding the current product)
            var prodExist = await repo.GetByName(addProductDTO.Name);
            if (prodExist != null && prodExist.Id != Id)
            {
                return BadRequest("A product with the same name already exists.");
            }

            // Update the fields
            existingProduct.Name = addProductDTO.Name;
            existingProduct.Description = addProductDTO.Description;
            existingProduct.Price = addProductDTO.Price;
            existingProduct.DiscountRate = addProductDTO.DiscountRate;
            existingProduct.PrepTime = addProductDTO.PrepTime;
            existingProduct.CategoryId = addProductDTO.CategoryId;


            // update the ingredients
            var previousIngredients = existingProduct.Ingredients; // List of Ingredient models
            var newIngredients = addProductDTO.Ingredients; // List of IngredientDTOs

            // Ingredients to Add: Convert DTOs to Ingredient models and add only new ones
            var ingredientsToAdd = newIngredients
                .Where(newIngredient => !previousIngredients.Any(oldIngredient => oldIngredient.Name == newIngredient.Name))
                .Select(newIngredient => new Ingredient { Name = newIngredient.Name })  // Convert to Ingredient
                .ToList();

            // Ingredients to Delete: Find ingredients in the old list but not in the new list
            var ingredientsToDelete = previousIngredients
                .Where(oldIngredient => !newIngredients.Any(newIngredient => newIngredient.Name == oldIngredient.Name))
                .ToList();

            // update the supplements
            var previousSupplements = existingProduct.Supplements; // List of Supplement models
            var newSupplements = addProductDTO.Supplements; // List of SupplementDTOs

            // Supplements to Add: Convert DTOs to Supplement models and add only new ones
            var supplementsToAdd = newSupplements
                .Where(newSupplement => !previousSupplements.Any(oldSupplement => oldSupplement.Name == newSupplement.Name))
                .Select(newSupplement => new Supplement
                {
                    Name = newSupplement.Name,
                    Price = newSupplement.Price // Include Price in the new supplement
                })
                .ToList();

            // Supplements to Delete: Find supplements in the old list but not in the new list
            var supplementsToDelete = previousSupplements
                .Where(oldSupplement => !newSupplements.Any(newSupplement => newSupplement.Name == oldSupplement.Name))
                .ToList();

            // update the images
            var previousImages = existingProduct.Images; // List of Images models
            var newImages = images; // List of images


            // Images to Add: Convert DTOs to Image models and add only new ones
            var imagesToAdd = newImages
                .Where(newImage => !previousImages.Any(oldImage => oldImage.ImagePath == newImage.FileName))
                .ToList();

            // Images to Delete: Find images in the old list but not in the new list
            var imagesToDelete = previousImages
                .Where(oldImage => !newImages.Any(newImage => newImage.FileName == oldImage.ImagePath))
                .ToList();


            // Treating the database updates
            // Add Ingredients
            foreach (var ingredient in ingredientsToAdd)
            {
                await ingredientrepo.Add(new Ingredient
                {
                    ProductId = existingProduct.Id,
                    Name = ingredient.Name
                });
            }

            // Delete Ingredients
            foreach (var ingredient in ingredientsToDelete)
            {
                await ingredientrepo.Delete((await ingredientrepo.GetByProductIdandName(existingProduct.Id, ingredient.Name)).Id);
            }

            // Add Supplements
            foreach (var supplement in supplementsToAdd)
            {
                await supplementrepo.Add(new Supplement
                {
                    ProductId = existingProduct.Id,
                    Name = supplement.Name,
                    Price = supplement.Price
                });
            }

            // Delete Supplements
            foreach (var supplement in supplementsToDelete)
            {
                await supplementrepo.Delete((await supplementrepo.GetByProductIdandName(existingProduct.Id, supplement.Name)).Id);
            }

            // Add Images
            foreach (var image in imagesToAdd)
            {
                // upload static file to uploads

                // Generate a unique file name
                var uniqueFileName = $"{Guid.NewGuid()}_{image.FileName}";

                // Define the path to save the file (local storage example)
                var filePath = Path.Combine("wwwroot/uploads", uniqueFileName);

                // Ensure the directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                // Save the file to the specified path
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                // Save
                await imagerepo.Add(new Image
                {
                    ProductId = existingProduct.Id,
                    ImagePath = $"/uploads/{uniqueFileName}"
                });
            }

            // Delete Images
            foreach (var image in imagesToDelete)
            {
                await imagerepo.Delete((await imagerepo.GetByProductIdandImagePath(existingProduct.Id, image.ImagePath)).Id);
            }


            // Save the updated product
            var updatedProduct = await repo.Edit(existingProduct);

            return Ok(updatedProduct);
        }

        [HttpDelete("DeleteProduct/{Id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int Id)
        {   
            // If he's not an admin then quit
            var requestUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (requestUserRole != "Admin")
            {
                return Unauthorized("Only Admins are allowed.");
            }
            
            var existingProduct = await repo.Get(Id);
            if (existingProduct == null)
            {
                return NotFound();
            }
            await repo.Delete(Id);
            return Ok();
        }

    }
}