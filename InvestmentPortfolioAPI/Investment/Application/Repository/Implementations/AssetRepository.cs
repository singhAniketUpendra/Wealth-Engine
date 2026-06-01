using Investment.Application.Repository.Interfaces;
using Investment.Domain.Entities;
using Investment.Domain.Enums;
using Investment.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Investment.Application.Repository.Implementations
{
    public class AssetRepository : IAssetRepository
    {
        private readonly ApplicationDbContext _context;
        public AssetRepository(ApplicationDbContext context) => _context = context;

        public async Task<Asset?> GetByIdAsync(int id) =>
            await _context.Assets.FindAsync(id);

        public async Task<IEnumerable<Asset>> GetAllAsync()
        {
            return await _context.Assets
                .Where(a => a.IsActive)
                .ToListAsync();
        }

        public async Task<IEnumerable<Asset>> GetByTypeAsync(AssetType type)
        {
            return await _context.Assets
                .Where(a => a.Type == type && a.IsActive)
                .ToListAsync();
        }

        public async Task AddAsync(Asset asset)
        {
            await _context.Assets.AddAsync(asset);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Asset asset)
        {
            _context.Assets.Update(asset);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset != null)
            {
                asset.IsActive = false;
                await _context.SaveChangesAsync();
            }
        }
    }
}
