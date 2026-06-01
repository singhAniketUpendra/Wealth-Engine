using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;

namespace Investment.Application.Service.Interface
{
    public interface ITransactionService
    {
        Task<TransactionResponseDto> ExecuteTransactionAsync(TransactionRequestDto request);
        Task<TransactionResponseDto?> GetTransactionByIdAsync(int id);

        Task<IEnumerable<TransactionResponseDto>> GetAllTransactionsForAdminAsync();

        Task<IEnumerable<TransactionResponseDto>> GetUserHistoryAsync(int userId);
        Task<IEnumerable<TransactionResponseDto>> GetPortfolioHistoryAsync(int portfolioId);

        // Added for completeness
        Task<bool> DeleteTransactionAsync(int id);
    }
}

