using Microsoft.EntityFrameworkCore;
using Altairis.Api.Data;
using System.Text.Json.Serialization;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// Controladores + JSON para evitar ciclos de referencia en EF.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true; 
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS para el frontend local.
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// SQLite en la ruta persistida del contenedor.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=/app/data/altairis.db"));

var app = builder.Build();

app.UseCors("frontend");

// Aplica migraciones al iniciar para asegurar esquema.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Seed de datos en Development para pruebas rápidas
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        try
        {
            if (!db.Hotels.Any())
            {
                var h1 = new Altairis.Api.Models.Hotel { Name = "Demo Grand", City = "Ciudad X", Country = "País Y" };
                var h2 = new Altairis.Api.Models.Hotel { Name = "Ocean View", City = "Costa", Country = "País Z" };
                db.Hotels.AddRange(h1, h2);
                db.SaveChanges();

                db.RoomTypes.AddRange(
                    new Altairis.Api.Models.RoomType { Name = "Sencilla", Capacity = 1, HotelId = h1.Id },
                    new Altairis.Api.Models.RoomType { Name = "Doble", Capacity = 2, HotelId = h1.Id },
                    new Altairis.Api.Models.RoomType { Name = "Suite", Capacity = 3, HotelId = h2.Id },
                    new Altairis.Api.Models.RoomType { Name = "Familiar", Capacity = 4, HotelId = h2.Id }
                );
                db.SaveChanges();
            }
        }
        catch
        {
            // no interrumpir el arranque por errores de seed
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Endpoint de ejemplo del template.
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

