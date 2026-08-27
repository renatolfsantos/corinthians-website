using CorinthiansApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CorinthiansApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayersController : ControllerBase
{
    private readonly FootballService _footballService;

    public PlayersController(FootballService footballService)
    {
        _footballService = footballService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPlayers()
    {
        var players = await _footballService.GetCorinthiansSquad();

        return Ok(players);
    }


}