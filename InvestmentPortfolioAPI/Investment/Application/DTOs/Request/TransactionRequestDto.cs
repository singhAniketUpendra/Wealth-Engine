using Investment.Domain.Enums;

namespace Investment.Application.DTOs.Request
{
    public class TransactionRequestDto
    {
        public int PortfolioId { get; set; }
        public int AssetId { get; set; }
        public TransactionType Type { get; set; }
        public decimal Quantity { get; set; }
        public decimal PriceAtTransaction { get; set; }
    }
}
