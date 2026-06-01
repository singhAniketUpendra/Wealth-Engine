using Investment.Domain.Enums;

namespace Investment.Domain.Entities
{
    public class Asset
    {
        public int Id { get; set; }
        public string TickerSymbol { get; set; } = string.Empty; // e.g., AAPL
        public string AssetName { get; set; } = string.Empty;
        public AssetType Type { get; set; }
        public decimal CurrentPrice { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
