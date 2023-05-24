using API.Data;
using API.Exstensions;
using API.Middleware;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;

var builder = WebApplication.CreateBuilder(args);


// IEnumerable<string>? initialScopes = builder.Configuration["DownstreamApi:Scopes"]?.Split(' ');

// builder.Services.AddMicrosoftIdentityWebAppAuthentication(builder.Configuration, "AzureAd")
//     .EnableTokenAcquisitionToCallDownstreamApi(initialScopes)
//         .AddDownstreamWebApi("DownstreamApi", builder.Configuration.GetSection("DownstreamApi"))
//         .AddInMemoryTokenCaches();
// // </ms_docref_add_msal>

// // <ms_docref_add_default_controller_for_sign-in-out>
// builder.Services.AddRazorPages().AddMvcOptions(options =>
//     {
//         var policy = new AuthorizationPolicyBuilder()
//                       .RequireAuthenticatedUser()
//                       .Build();
//         options.Filters.Add(new AuthorizeFilter(policy));
//     }).AddMicrosoftIdentityUI();
// </ms_docref_add_default_controller_for_sign-in-out>



// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();


app.UseMiddleware<ExceptionMiddleware>();
// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();


// app.MapRazorPages();
app.MapControllers();

app.MapFallbackToController("Index", "Fallback");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
  var context = services.GetRequiredService<DataContext>();
  await context.Database.MigrateAsync();
  await Seed.SeedUsers(context);
}
catch (Exception ex)
{
  var logger = services.GetService<ILogger<Program>>();
  logger.LogError(ex, "An error occured during migration or seeding");
}

app.Run();
