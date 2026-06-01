using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;
using Investment.Application.Service.Interface;
using Microsoft.AspNetCore.Authorization; // 🔥 Security ke liye
using Microsoft.AspNetCore.Mvc;

namespace Investment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 🔒 Lock: Bina login ke yahan entry bilkul band hai
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        // User & Admin: Koi bhi investor (User) ya Admin trade execute kar sakta hai
        [HttpPost("execute")]
        public async Task<ActionResult<TransactionResponseDto>> Execute(TransactionRequestDto request)
        {
            // Note: Middleware handle kar lega, try-catch hata sakte ho
            var transaction = await _transactionService.ExecuteTransactionAsync(request);
            return Ok(transaction);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetUserHistory(int userId)
        {
            // Strict Security Check: Logged-in user apni hi ID mang sake (Ya agar Admin ho toh koi bhi)
            var history = await _transactionService.GetUserHistoryAsync(userId);
            return Ok(history);
        }

        // User & Admin: Transaction history dekhna (User apna dekhega, Admin monitoring ke liye)
        [HttpGet("portfolio/{portfolioId}")]
        public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetHistory(int portfolioId)
        {
            var history = await _transactionService.GetPortfolioHistoryAsync(portfolioId);
            return Ok(history);
        }

        // Admin Only: Load entire system-wide master transactions auditing data
        [Authorize(Roles = "Admin")]
        [HttpGet("admin/all")]
        public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetAllForAdmin()
        {
            var masterLedger = await _transactionService.GetAllTransactionsForAdminAsync();
            return Ok(masterLedger);
        }

        // Admin Only: Transaction delete karna ek "Audit Violation" jaisa hai
        // Normal user ko kabhi trade history delete karne ki permission nahi deni chahiye
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _transactionService.DeleteTransactionAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}