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
    public class ProductCartController : ControllerBase
    {

        private readonly IProductCartRepository repo;
        private readonly IProductRepository productRepo;
        private readonly ICartRepository cartRepo;
        private readonly IIngredientRepository ingredientRepo;
        private readonly ISupplementRepository supplementRepo;
        private readonly IProductCartIngredientRepository productcartingredientRepo;
        private readonly IProductCartSupplementRepository productcartsupplementRepo;


        public ProductCartController(IProductCartRepository repository, IProductRepository productRepo, ICartRepository cartRepo, IIngredientRepository ingredientRepo, ISupplementRepository supplementRepo, IProductCartIngredientRepository productcartingredientRepo, IProductCartSupplementRepository productcartsupplementRepo)
        {
            this.repo = repository;
            this.productRepo = productRepo;
            this.cartRepo = cartRepo;
            this.ingredientRepo = ingredientRepo;
            this.supplementRepo = supplementRepo;
            this.productcartingredientRepo = productcartingredientRepo;
            this.productcartsupplementRepo = productcartsupplementRepo;
        }



        [HttpPost("AddProductCart")]
        [Authorize]
        public async Task<IActionResult> Add(AddProductCartDTO prodcartDTO)
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

            // Check if the the cart is availble
            var Cart = await cartRepo.GetByUserId(parsedUserId);
            if (Cart == null)
            {
                return NotFound($"Cart with userId {parsedUserId} not found.");
            }

            // Check if the the product is availble
            var Product = await productRepo.Get(prodcartDTO.ProductId);
            if (Product == null)
            {
                return NotFound($"Product with {prodcartDTO.ProductId} not found.");
            }

            // Check if the ProductCart already exists
            var existingProductCart = await repo.Get(prodcartDTO.ProductId, Cart.Id);
            if (existingProductCart != null)
            {
                return BadRequest("Product Exists Already, Try AddQuantity");
            }

            // Load ingredients to the new_ProductCartIngredients
            List<ProductCartIngredient> new_ProductCartIngredients = new List<ProductCartIngredient>();
            foreach (var ingredientId in prodcartDTO.IngredientIds)
            {
                var ingredient = await ingredientRepo.Get(ingredientId);
                if (ingredient == null)
                {
                    return BadRequest($"Ingredient with ID {ingredientId} not found.");
                }
                var ProductCartingredientEntity = new ProductCartIngredient
                {
                    ProductCartId = prodcartDTO.ProductId,
                    Name = ingredient.Name
                };
                new_ProductCartIngredients.Add(ProductCartingredientEntity);
            }

            // Load supplements to the new_ProductCartSupplements
            List<ProductCartSupplement> new_ProductCartSupplements = new List<ProductCartSupplement>();
            foreach (var supplementId in prodcartDTO.SupplementIds)
            {
                var supplement = await supplementRepo.Get(supplementId);
                if (supplement == null)
                {
                    return BadRequest($"Supplement with ID {supplementId} not found.");
                }
                var supplementEntity = new ProductCartSupplement
                {
                    ProductCartId = prodcartDTO.ProductId,
                    Name = supplement.Name,
                    Price = supplement.Price
                };
                new_ProductCartSupplements.Add(supplementEntity);
            }


            // Fetch the product and cart entities
            var product = await productRepo.Get(prodcartDTO.ProductId);
            var cart = await cartRepo.Get(Cart.Id);

            // Null checks for product and cart
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            if (cart == null)
            {
                return NotFound("Cart not found.");
            }

            // Check if the product has images
            if (product.Images == null || !product.Images.Any())
            {
                return NotFound("No images found for this product.");
            }

            // Create a new ProductCart entity
            var entity = new ProductCart
            {
                ProductId = prodcartDTO.ProductId,
                CartId = Cart.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                DiscountRate = product.DiscountRate,
                PrepTime = product.PrepTime,
                Quantity = prodcartDTO.Quantity,
                ImagePath = product.Images[0].ImagePath,
                ProductCartIngredients = new_ProductCartIngredients,
                ProductCartSupplements = new_ProductCartSupplements
            };

            // Save the new ProductCart entity
            var newProdCart = await repo.Add(entity);

            // Return the newly created ProductCart with a 201 Created status
            return CreatedAtAction(nameof(Get), new { ProductId = newProdCart.ProductId, CartId = newProdCart.CartId }, newProdCart);
        }


        [HttpPut("AddQuantity/{ProductId:int}")]
        [Authorize]
        public async Task<IActionResult> AddQuantity(int ProductId)
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

            // Check if the ProductCart already exists
            var existingProductCart = await repo.Get(ProductId, Cart.Id);
            if (existingProductCart == null)
            {
                return NotFound("Product Not Found");
            }
            // Increment the quantity if the productCart already exists
            existingProductCart.Quantity += 1;
            await repo.Edit(existingProductCart);
            return Ok(existingProductCart);
        }


        [HttpPut("RemoveQuantity/{ProductId:int}")]
        [Authorize]
        public async Task<IActionResult> RemoveQuantity(int ProductId)
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

            // Check if the ProductCart already exists
            var existingProductCart = await repo.Get(ProductId, Cart.Id);
            if (existingProductCart == null)
            {
                return NotFound("Product Not Found");
            }

            // Decrement the quantity
            existingProductCart.Quantity -= 1;

            if (existingProductCart.Quantity <= 0)
            {
                // If quantity is zero or less, delete the entity
                await repo.Delete(existingProductCart);
                return Ok("Product Deleted");
            }
            else
            {
                // Otherwise, update the entity with the decremented quantity
                await repo.Edit(existingProductCart);
                return Ok(existingProductCart);
            }
        }

        [HttpGet("GetProductCart/{ProductId:int}/{CartId:int}")]
        public async Task<IActionResult> Get(int ProductId, int CartId)
        {
            var productCart = await repo.Get(ProductId, CartId);
            if (productCart == null)
            {
                return NotFound();
            }

            return Ok(productCart);
        }

    }
}
