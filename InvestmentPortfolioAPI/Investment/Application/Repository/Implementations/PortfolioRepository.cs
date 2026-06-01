using Investment.Application.Repository.Interfaces;
using Investment.Domain.Entities;
using Investment.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Investment.Application.Repository.Implementations
{
    public class PortfolioRepository : IPortfolioRepository
    {
        private readonly ApplicationDbContext _context;
        public PortfolioRepository(ApplicationDbContext context) => _context = context;

        public async Task<Portfolio?> GetByIdWithTransactionsAsync(int id)
        {
            return await _context.Portfolios
                .Include(p => p.Transactions)
                .ThenInclude(t => t.Asset) 
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Portfolio>> GetByUserIdAsync(int userId)
        {
            return await _context.Portfolios
                .Where(p => p.UserId == userId)
                .ToListAsync();
        }

        public async Task AddAsync(Portfolio portfolio)
        {
            await _context.Portfolios.AddAsync(portfolio);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Portfolio portfolio)
        {
            _context.Portfolios.Update(portfolio);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var portfolio = await _context.Portfolios.FindAsync(id);
            if (portfolio != null)
            {
                _context.Portfolios.Remove(portfolio);
                await _context.SaveChangesAsync();
            }
        }
    }
}
