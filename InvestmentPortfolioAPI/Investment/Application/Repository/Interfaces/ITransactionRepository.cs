using Investment.Domain.Entities;

namespace Investment.Application.Repository.Interfaces
{
    public interface ITransactionRepository
    {
        Task<Transaction?> GetByIdAsync(int id);
        Task<IEnumerable<Transaction>> GetAllTransactionsWithUsersAsync();
        Task<IEnumerable<Transaction>> GetByPortfolioIdAsync(int portfolioId);

        Task<IEnumerable<Transaction>> GetByUserIdAsync(int userId);
        Task AddAsync(Transaction transaction);
        Task DeleteAsync(int id);
    }
}
