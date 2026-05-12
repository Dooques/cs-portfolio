using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace cs_portfolio.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("Privacy")]
        public IActionResult Privacy()
        {
            return View();
        }
    }
}
