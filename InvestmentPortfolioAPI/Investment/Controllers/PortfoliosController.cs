using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;
using Investment.Application.Service.Interface;
using Microsoft.AspNetCore.Authorization; // 🔥 Mandatory for Security
using Microsoft.AspNetCore.Mvc;

namespace Investment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 🔒 Pure controller ko lock kar diya. Bina login ke yahan entry band hai.
    public class PortfoliosController : ControllerBase
    {
        private readonly IPortfolioService _portfolioService;

        public PortfoliosController(IPortfolioService portfolioService)
        {
            _portfolioService = portfolioService;
        }

        // User & Admin: Koi bhi apna portfolio bana sakta hai
        [HttpPost]
        public async Task<ActionResult<PortfolioResponseDto>> Create(PortfolioRequestDto request)
        {
            var portfolio = await _portfolioService.CreatePortfolioAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = portfolio.Id }, portfolio);
        }

        // User & Admin: Portfolio details dekhne ke liye authenticated hona zaroori hai
        [HttpGet("{id}")]
        public async Task<ActionResult<PortfolioResponseDto>> GetById(int id)
        {
            var portfolio = await _portfolioService.GetPortfolioByIdAsync(id);
            if (portfolio == null) return NotFound();
            return Ok(portfolio);
        }

        // Admin Only (Generally): Kisi bhi userId ka data nikalna Admin ka kaam hai
        // Note: Production mein hum check karte hain ki userId logged-in user ki hi ho
        //[Authorize(Roles = "Admin")]
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<PortfolioResponseDto>>> GetByUser(int userId)
        {
            var portfolios = await _portfolioService.GetUserPortfoliosAsync(userId);
            return Ok(portfolios);
        }

        // 🔥 User & Admin: Pure Portfolio ka complete breakdown, profit/loss aur risk score dekhne ke liye
        [HttpGet("{id}/summary")]
        public async Task<ActionResult<PortfolioSummaryDto>> GetPortfolioSummary(int id)
        {
            // Ye method tumhare PortfolioService se poora calculations wala object uthayega
            var summaryDto = await _portfolioService.GetPortfolioSummaryAsync(id);

            if (summaryDto == null) return NotFound("Portfolio calculations failed or not found.");

            return Ok(summaryDto); // 🔥 Ab poora JSON object React ko milega makkhan tarike se
        }

        // User & Admin: Portfolio ka naam/details update karna
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, PortfolioRequestDto request)
        {
            var updated = await _portfolioService.UpdatePortfolioAsync(id, request);
            return Ok(updated);
        }

        // Admin Only: Portfolio delete karna heavy action hai, Admin ko control de rahe hain
        // Ya phir User ko bhi de sakte ho, but Admin must have it.
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _portfolioService.DeletePortfolioAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}