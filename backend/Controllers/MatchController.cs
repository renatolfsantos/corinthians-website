using CorinthiansApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CorinthiansApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MatchesController : ControllerBase
{
    private readonly MatchService _matchService;

    public MatchesController(MatchService matchService)
    {
        _matchService = matchService;
    }

    [HttpGet("next")]
    public async Task<IActionResult> GetNextMatch()
    {
        var match =
            await _matchService.GetNextMatch();

        if (match == null)
        {
            return NotFound(
                new
                {
                    message = "Nenhum próximo jogo encontrado."
                }
            );
        }

        return Ok(match);
    }
}