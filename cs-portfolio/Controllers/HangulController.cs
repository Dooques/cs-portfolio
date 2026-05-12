using Microsoft.AspNetCore.Mvc;
using Hangulizer.Service;
using Hangulizer.Data;
using cs_portfolio.Models;

namespace cs_portfolio.Controllers
{
    [ApiController]
    public class HangulController: ControllerBase
    {
        [Route("hangul")]
        [HttpPost]
        public IActionResult ToEnglishPhonetics([FromBody] HangulRequest request)
        {
            var ht = new HangulTranslator(HangulLibrary.Hangul);
            string result = ht.TranslateToPhonetic(request.text);
            Console.WriteLine(request.text);
            Console.WriteLine(result);
            return Ok(new { text = result });
        }
    }
}
