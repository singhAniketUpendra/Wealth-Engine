using Investment.Domain.Enums;

namespace Investment.Domain.Entities
{
    public class Transaction
    {
        public int Id { get; set; }
        public int PortfolioId { get; set; }
        public int AssetId { get; set; }
        public TransactionType Type { get; set; }
        public decimal Quantity { get; set; }
        public decimal PriceAtTransaction { get; set; }
        public DateTime TransactionDate { get; set; }

        // Navigation properties
        public Portfolio Portfolio { get; set; } = null!;
        public Asset Asset { get; set; } = null!;
    }
}
