namespace CorinthiansApi.Models;

public class Player
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int Age { get; set; }

    public int? Number { get; set; }

    public string Position { get; set; } = string.Empty;

    public string Photo { get; set; } = string.Empty;
}