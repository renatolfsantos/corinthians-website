using CorinthiansApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://corinthians-website.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddMemoryCache();

builder.Services.AddScoped<FootballService>();
builder.Services.AddHttpClient<MatchService>();

var app = builder.Build();

app.Use(async (context, next) =>
{
    Console.WriteLine("========== REQUEST ==========");
    Console.WriteLine($"Path: {context.Request.Path}");
    Console.WriteLine($"Method: {context.Request.Method}");
    Console.WriteLine($"Origin: {context.Request.Headers.Origin}");
    Console.WriteLine("=============================");

    await next();
});


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontend");

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();