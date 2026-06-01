using Investment.Domain.Enums;

namespace Investment.Application.DTOs.Request
{
    public class AssetRequestDto
    {
        public string TickerSymbol { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public AssetType Type { get; set; }
        public decimal CurrentPrice { get; set; }
    }
}
