using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace FStudyForum.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LinkController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> FetchUrl([FromQuery] string url)
    {
        if (string.IsNullOrEmpty(url))
        {
            return BadRequest("Invalid href");
        }

        try
        {
            using var client = new HttpClient();
            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();

            string html = await response.Content.ReadAsStringAsync();

            string title = ExtractMatchValue(html, "<title>(.*?)</title>");
            string description = ExtractMatchValue(html, "<meta name=\"description\" content=\"(.*?)\"");
            string imageUrl = ExtractMatchValue(html, "<meta property=\"og:image\" content=\"(.*?)\"");

            return Ok(new
            {
                success = 1,
                meta = new
                {
                    title,
                    description,
                    image = new
                    {
                        url = imageUrl
                    }
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    private string ExtractMatchValue(string input, string pattern)
    {
        var match = Regex.Match(input, pattern);
        return match.Success ? match.Groups[1].Value : string.Empty;
    }
}
