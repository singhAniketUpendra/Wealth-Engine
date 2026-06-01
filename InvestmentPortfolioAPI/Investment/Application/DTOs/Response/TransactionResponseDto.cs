namespace Investment.Application.DTOs.Response
{
    public class TransactionResponseDto
    {
        public int Id { get; set; }
        public int PortfolioId { get; set; }
        public string AssetName { get; set; } = string.Empty;
        public int Type { get; set; } // Matches context int enum mapping conversion
        public decimal Quantity { get; set; }
        public decimal PriceAtTransaction { get; set; }
        public DateTime TransactionDate { get; set; }

        // 🔥 ADMIN SPECIFIC METADATA ATTACHMENTS
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}