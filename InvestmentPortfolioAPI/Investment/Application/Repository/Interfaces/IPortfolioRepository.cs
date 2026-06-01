using Investment.Domain.Entities;

namespace Investment.Application.Repository.Interfaces
{
    public interface IPortfolioRepository
    {
        Task<Portfolio?> GetByIdWithTransactionsAsync(int id);
        Task<IEnumerable<Portfolio>> GetByUserIdAsync(int userId);
        Task AddAsync(Portfolio portfolio);
        Task UpdateAsync(Portfolio portfolio);
        Task DeleteAsync(int id);
    }
}
