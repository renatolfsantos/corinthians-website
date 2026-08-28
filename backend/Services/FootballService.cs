using CorinthiansApi.Models;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;

namespace CorinthiansApi.Services;

public class FootballService
{
    private readonly IMemoryCache _cache;
    private readonly IWebHostEnvironment _environment;

    public FootballService(
        IMemoryCache cache,
        IWebHostEnvironment environment)
    {
        _cache = cache;
        _environment = environment;
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
        Console.WriteLine("BUSCANDO NO JSON");
        Console.WriteLine("=================");

        var filePath = Path.Combine(
            _environment.ContentRootPath,
            "Data",
            "players.json"
        );

        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException(
                "Arquivo players.json não encontrado.",
                filePath
            );
        }

        var json = await File.ReadAllTextAsync(filePath);

        var players = JsonSerializer.Deserialize<List<Player>>(
            json,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }
        );

        if (players is null)
        {
            return [];
        }

        _cache.Set(
            cacheKey,
            players,
            TimeSpan.FromHours(6)
        );

        Console.WriteLine("===== ELENCO =====");
        Console.WriteLine("DADOS SALVOS NO CACHE");
        Console.WriteLine("===================");

        return players;
    }
}