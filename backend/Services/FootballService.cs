using CorinthiansApi.Models;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;

namespace CorinthiansApi.Services;

public class FootballService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IMemoryCache _cache;

    public FootballService(
        HttpClient httpClient,
        IConfiguration configuration,
        IMemoryCache cache)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _cache = cache;
    }

    public async Task<List<Player>> GetCorinthiansSquad()
    {
        const string cacheKey = "corinthians-squad";

        if (_cache.TryGetValue(cacheKey, out List<Player>? cachedPlayers))
        {
            Console.WriteLine("===== ELENCO =====");
            Console.WriteLine("DADOS VINDOS DO CACHE");
            Console.WriteLine("===================");

            return cachedPlayers!;
        }

        Console.WriteLine("===== ELENCO =====");
        Console.WriteLine("BUSCANDO NA API");
        Console.WriteLine("=================");

        var apiKey = _configuration["FootballApi:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new Exception("API Key não encontrada.");
        }

        using var request = new HttpRequestMessage(
            HttpMethod.Get,
            "players/squads?team=131"
        );

        request.Headers.Add("x-apisports-key", apiKey);

        using var response = await _httpClient.SendAsync(request);

        var json = await response.Content.ReadAsStringAsync();

        Console.WriteLine(json);

        response.EnsureSuccessStatusCode();

        using var document = JsonDocument.Parse(json);

        var root = document.RootElement;

        var errors = root.GetProperty("errors");

        if (errors.ValueKind == JsonValueKind.Object &&
            errors.EnumerateObject().Any())
        {
            throw new Exception(
                $"API-Football retornou erro: {errors}"
            );
        }

        var responseArray = root.GetProperty("response");

        if (responseArray.GetArrayLength() == 0)
        {
            return [];
        }

        var players = responseArray[0]
            .GetProperty("players");

        var result = new List<Player>();

        foreach (var player in players.EnumerateArray())
        {
            result.Add(new Player
            {
                Id = player.GetProperty("id").GetInt32(),

                Name = player.GetProperty("name").GetString()
                    ?? string.Empty,

                Age = player.GetProperty("age").GetInt32(),

                Number =
                    player.TryGetProperty("number", out var number) &&
                    number.ValueKind != JsonValueKind.Null
                        ? number.GetInt32()
                        : null,

                Position = player.GetProperty("position").GetString()
                    ?? string.Empty,

                Photo = player.GetProperty("photo").GetString()
                    ?? string.Empty
            });
        }

        result.Add(new Player
        {
            Id = 667,
            Name = "Memphis Depay",
            Age = 32,
            Number = 10,
            Position = "Attacker",
            Photo = "https://media.api-sports.io/football/players/667.png"
        });

        result.Add(new Player
        {
            Id = 43752,
            Name = "Fernando Diniz",
            Age = 52,
            Number = null,
            Position = "Técnico",
            Photo = "https://imagecache.365scores.com/image/upload/f_png,w_80,h_80,c_limit,q_auto:eco,dpr_2,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/Athletes/43752"
        });

        _cache.Set(
            cacheKey,
            result,
            TimeSpan.FromHours(6)
        );

        Console.WriteLine("===== ELENCO =====");
        Console.WriteLine("DADOS SALVOS NO CACHE");
        Console.WriteLine("===================");

        return result;
    }
}