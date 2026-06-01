using Investment.Application.Repository.Interfaces;
using Investment.Domain.Entities;
using Investment.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Investment.Application.Repository.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRepository(ApplicationDbContext context) => _context = context;

        public async Task<User?> GetByIdAsync(int id) => await _context.Users.FindAsync(id);
        public async Task<IEnumerable<User>> GetAllAsync() => await _context.Users.ToListAsync();
        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                // Soft Delete Flag Setup
                user.IsDeleted = true;

                //// State configuration explicitly modified for tracked entity context execution
                //_context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }
    }
}
