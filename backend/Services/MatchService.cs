using System.Text.Json;
using CorinthiansApi.Models;
using Microsoft.Extensions.Caching.Memory;

namespace CorinthiansApi.Services;

public class MatchService
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;

    public MatchService(
        HttpClient httpClient,
        IMemoryCache cache)
    {
        _httpClient = httpClient;
        _cache = cache;
    }

    public async Task<Match?> GetNextMatch()
    {
        const string cacheKey = "corinthians-next-match";

        if (_cache.TryGetValue(
            cacheKey,
            out Match? cachedMatch))
        {
            Console.WriteLine("NEXT MATCH: CACHE");

            return cachedMatch;
        }

        Console.WriteLine("NEXT MATCH: API");

        var url =
            "https://sportscore.com/api/widget/team/?sport=football&slug=corinthians-sp&limit=30";

        var response = await _httpClient.GetAsync(url);

        var json = await response.Content.ReadAsStringAsync();

        Console.WriteLine($"STATUS: {(int)response.StatusCode}");
        Console.WriteLine("===== SPORT SCORE =====");
        Console.WriteLine(json);
        Console.WriteLine("======================");

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception(
                $"SportScore retornou {(int)response.StatusCode}: {json}"
            );
        }

        using var document =
            JsonDocument.Parse(json);

        var matches =
            document.RootElement
                .GetProperty("matches");

        var now = DateTime.UtcNow;

        Match? nextMatch = null;

        foreach (var match in matches.EnumerateArray())
        {
            var status =
                match.GetProperty("status")
                    .GetString();

            var timeString =
                match.GetProperty("time")
                    .GetString();

            if (status != "upcoming" ||
                string.IsNullOrEmpty(timeString))
            {
                continue;
            }

            var time =
                DateTime.Parse(
                    timeString,
                    null,
                    System.Globalization.DateTimeStyles.RoundtripKind
                );

            if (time <= now)
            {
                continue;
            }

            if (nextMatch != null &&
                time >= nextMatch.Time)
            {
                continue;
            }

            var home =
                match.GetProperty("home")
                    .GetString()
                ?? string.Empty;

            var away =
                match.GetProperty("away")
                    .GetString()
                ?? string.Empty;

            var competition =
                match.GetProperty("competition")
                    .GetString()
                ?? string.Empty;

            nextMatch = new Match
            {
                Home = FormatTeamName(home),

                Away = FormatTeamName(away),

                HomeLogo = FormatTeamLogo(
                    home,
                    match.GetProperty("home_logo")
                        .GetString()
                    ?? string.Empty
                ),

                AwayLogo = FormatTeamLogo(
                    away,
                    match.GetProperty("away_logo")
                        .GetString()
                    ?? string.Empty
                ),

                Status = status ?? string.Empty,

                StatusText =
                    match.GetProperty("status_text")
                        .GetString()
                    ?? string.Empty,

                Time = time,

                Competition =
                    FormatCompetitionName(competition),

                CompetitionLogo =
                    match.GetProperty("competition_logo")
                        .GetString()
                    ?? string.Empty
            };
        }

        _cache.Set(
            cacheKey,
            nextMatch,
            TimeSpan.FromMinutes(10)
        );

        return nextMatch;
    }

    private static string FormatTeamName(string name)
    {
        var states = new[]
        {
            " - SP",
            " - RJ",
            " - MG",
            " - RS",
            " - BA",
            " - PA",
            " - PR",
            " - SC",
            " - GO",
            " - PE",
            " - CE",
            " - ES",
            " - DF"
        };

        foreach (var state in states)
        {
            if (name.EndsWith(
                state,
                StringComparison.OrdinalIgnoreCase
            ))
            {
                return name[..^state.Length].Trim();
            }
        }

        return name;
    }

    private static string FormatTeamLogo(
        string name,
        string apiLogo
    )
    {
        if (name.Contains(
            "corinthians",
            StringComparison.OrdinalIgnoreCase
        ))
        {
            return "/logo_colored.png";
        }

        return apiLogo;
    }

    private static string FormatCompetitionName(
        string competition
    )
    {
        var normalized =
            competition
                .ToLower()
                .Trim();

        if (normalized.Contains("serie a") &&
            normalized.Contains("brazil"))
        {
            return "Campeonato Brasileiro";
        }

        if (normalized.Contains("libertadores"))
        {
            return "CONMEBOL Libertadores";
        }

        if (normalized.Contains("sudamericana") ||
            normalized.Contains("sul-americana") ||
            normalized.Contains("sul americana"))
        {
            return "CONMEBOL Sul-Americana";
        }

        if (normalized.Contains("copa do brasil") ||
            normalized.Contains("brazilian cup"))
        {
            return "Copa do Brasil";
        }

        return competition;
    }
}