using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using Sage.Models;
using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Inject Db Context Class
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 1;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredUniqueChars = 0;
});


// Existing service registrations
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// Additional repositories
builder.Services.AddScoped<IDrinkRepository, DrinkRepository>();
builder.Services.AddScoped<IIngredientRepository, IngredientRepository>();
builder.Services.AddScoped<ISupplementRepository, SupplementRepository>();
builder.Services.AddScoped<IImageRepository, ImageRepository>();
builder.Services.AddScoped<IProductOfTheDayRepository, ProductOfTheDayRepository>();

// Product Cart Repositories
builder.Services.AddScoped<IProductCartRepository, ProductCartRepository>();
builder.Services.AddScoped<IProductCartIngredientRepository, ProductCartIngredientRepository>();
builder.Services.AddScoped<IProductCartSupplementRepository, ProductCartSupplementRepository>();

// Drink Cart Repositories
builder.Services.AddScoped<IDrinkCartRepository, DrinkCartRepository>();




builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

var claims = new List<Claim>
{
    new Claim("role", "Admin") // Use "role" directly instead of the default claim type.
};

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {

        IssuerSigningKey = new SymmetricSecurityKey
        (Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"])),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,
        // RoleClaimType = ClaimTypes.Role // This is important for role-based authorization
        // Here we specify that the "role" claim in the JWT will be used for role-based authorization.
        RoleClaimType = "role" // Custom claim type for roles
    };
});


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("UpdateProductPolicy", policy =>
        policy.RequireClaim("role", "admin")); // Example: Require 'role' claim to be 'admin'
});


// Add services to the container
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React app's origin
              .AllowAnyMethod()
              .AllowAnyHeader()
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowCredentials(); // If cookies/authentication are needed
    });
});


var app = builder.Build();


// Create roles on app start
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    // Initialize roles
    await CreateRolesAsync(roleManager, userManager);
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

// Use CORS Middleware
app.UseCors("AllowReactApp");
app.UseStaticFiles();
app.MapControllers();

app.Run();


// Role initialization logic
async Task CreateRolesAsync(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
{
    var roleNames = new[] { "Admin", "User" };

    foreach (var roleName in roleNames)
    {
        var roleExist = await roleManager.RoleExistsAsync(roleName);
        if (!roleExist)
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }

    var adminUser = await userManager.FindByEmailAsync("admin@gmail.com");
    if (adminUser == null)
    {
        var user = new ApplicationUser
        {
            Email = "admin@gmail.com",
            UserName = "admin",
            FullName = "Administrator"
        };

        var result = await userManager.CreateAsync(user, "23447715");

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, "Admin");
        }
        else
        {
            foreach (var error in result.Errors)
            {
                Console.WriteLine($"Error creating admin user: {error.Description}");
            }
        }
    }
}