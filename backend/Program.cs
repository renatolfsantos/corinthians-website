using CorinthiansApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://corinthians-website.vercel.app")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddHttpClient<FootballService>(client =>
{
    client.BaseAddress = new Uri("https://v3.football.api-sports.io/");
});

builder.Services.AddHttpClient<MatchService>();

builder.Services.AddMemoryCache();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("ReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();