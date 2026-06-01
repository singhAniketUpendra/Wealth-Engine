using Investment.Application.Repository.Interfaces;
using Investment.Domain.Entities;
using Investment.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Investment.Application.Repository.Implementations
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ApplicationDbContext _context;
        public TransactionRepository(ApplicationDbContext context) => _context = context;

        public async Task<IEnumerable<Transaction>> GetByPortfolioIdAsync(int portfolioId)
        {
            return await _context.Transactions
                .Where(t => t.PortfolioId == portfolioId)
                .Include(t => t.Asset)
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Transaction>> GetByUserIdAsync(int userId)
        {
            return await _context.Transactions
                .Include(t => t.Asset)
                .Include(t => t.Portfolio) // Portfolio include kiya taaki UserId tak pahunch sakein
                .Where(t => t.Portfolio.UserId == userId)
                .OrderByDescending(t => t.TransactionDate) // Taaki latest trades sabse upar dikhein
                .ToListAsync();
        }

        public async Task<IEnumerable<Transaction>> GetAllTransactionsWithUsersAsync()
        {
            return await _context.Transactions
                .Include(t => t.Asset)
                .Include(t => t.Portfolio)
                    .ThenInclude(p => p.User) // 🔥 Deep Navigation Property Link down to the User identity node
                .OrderByDescending(t => t.TransactionDate) // Master timeline tracking rule
                .ToListAsync();
        }

        public async Task AddAsync(Transaction transaction)
        {
            // Ensure the date is set if not provided
            if (transaction.TransactionDate == default)
                transaction.TransactionDate = DateTime.UtcNow;

            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();
        }

        public async Task<Transaction?> GetByIdAsync(int id)
        {
            return await _context.Transactions
                .Include(t => t.Asset)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task DeleteAsync(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction != null)
            {
                _context.Transactions.Remove(transaction);
                await _context.SaveChangesAsync();
            }
        }
    }
}
