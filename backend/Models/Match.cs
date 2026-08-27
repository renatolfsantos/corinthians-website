namespace CorinthiansApi.Models;

public class Match
{
    public string Home { get; set; } = string.Empty;
    public string Away { get; set; } = string.Empty;

    public string HomeLogo { get; set; } = string.Empty;
    public string AwayLogo { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;
    public string StatusText { get; set; } = string.Empty;

    public DateTime Time { get; set; }

    public string Competition { get; set; } = string.Empty;
    public string CompetitionLogo { get; set; } = string.Empty;
}