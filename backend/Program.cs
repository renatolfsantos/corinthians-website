using CorinthiansApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();

    });
});

builder.Services.AddMemoryCache();

builder.Services.AddScoped<FootballService>();
builder.Services.AddHttpClient<MatchService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontend");

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();