using Investment.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Investment.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Portfolio> Portfolios { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

           
           
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.Property(e => e.Quantity).HasPrecision(18, 4);
                entity.Property(e => e.PriceAtTransaction).HasPrecision(18, 2);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email)
                      .IsUnique();

                entity.Property(u => u.Email)
                      .IsRequired()
                      .HasMaxLength(150);

                entity.HasQueryFilter(u => !u.IsDeleted);
            });

           
            modelBuilder.Entity<Asset>(entity =>
            {
                entity.Property(e => e.CurrentPrice).HasPrecision(18, 2);
                entity.Property(e => e.TickerSymbol).IsRequired().HasMaxLength(10);
            });

            
            // Relation between Tables 

            modelBuilder.Entity<Portfolio>()
                .HasOne(p => p.User)
                .WithMany(u => u.Portfolios)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Portfolio)
                .WithMany(p => p.Transactions)
                .HasForeignKey(t => t.PortfolioId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Asset)
                .WithMany() // empty because we dont have navigation property in asset for transactions
                .HasForeignKey(t => t.AssetId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
