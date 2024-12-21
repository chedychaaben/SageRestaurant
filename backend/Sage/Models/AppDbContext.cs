using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Sage.Models
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }
        
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<ProductOfTheDay> ProductOfTheDays { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Drink> Drinks { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Supplement> Supplements { get; set; }

        // Relationships
        public DbSet<ProductCart> ProductCarts { get; set; }
        public DbSet<ProductCartIngredient> ProductCartIngredients { get; set; }
        public DbSet<ProductCartSupplement> ProductCartSupplements { get; set; }
        public DbSet<DrinkCart> DrinkCarts { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);  // Make sure this is called to ensure Identity configuration is applied.



            // ProductCart
            modelBuilder.Entity<ProductCart>()
                .HasOne<Cart>() // Define relationship with Cart
                .WithMany(c => c.ProductCarts)
                .HasForeignKey(pc => pc.CartId);

            // DrinkCart
            modelBuilder.Entity<DrinkCart>()
                .HasOne<Cart>() // Define relationship with Cart
                .WithMany(c => c.DrinkCarts)
                .HasForeignKey(dc => dc.CartId);

            // Define many-to-one relationship between Product and Ingredient
            modelBuilder.Entity<Ingredient>()
                .HasOne<Product>() // Specify the target entity type explicitly
                .WithMany(p => p.Ingredients) // Use the collection navigation property in Product
                .HasForeignKey(i => i.ProductId); // Specify the foreign key

            // Define many-to-one relationship between Product and Supplement
            modelBuilder.Entity<Supplement>()
                .HasOne<Product>() // Specify the target entity type explicitly
                .WithMany(p => p.Supplements) // Use the collection navigation property in Product
                .HasForeignKey(s => s.ProductId); // Specify the foreign key



            // Define many-to-one relationship between ProductCart and Ingredient
            modelBuilder.Entity<ProductCartIngredient>()
                .HasOne<ProductCart>() // Specify the target entity type explicitly
                .WithMany(pc => pc.ProductCartIngredients) // Use the collection navigation property in Product
                .HasForeignKey(pci => pci.ProductCartId); // Specify the foreign key

            // Define many-to-one relationship between ProductCart and Supplement
            modelBuilder.Entity<ProductCartSupplement>()
                .HasOne<ProductCart>() // Specify the target entity type explicitly
                .WithMany(pc => pc.ProductCartSupplements) // Use the collection navigation property in Product
                .HasForeignKey(pcs => pcs.ProductCartId); // Specify the foreign key

            modelBuilder.Entity<Cart>()
           .HasMany(c => c.ProductCarts)
           .WithOne()  // Define the reverse relationship if necessary
           .HasForeignKey("CartId"); // Ensure the correct foreign key relationship

        }

    }
}
