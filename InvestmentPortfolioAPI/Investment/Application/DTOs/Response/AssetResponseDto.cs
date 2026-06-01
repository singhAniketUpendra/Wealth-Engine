using Investment.Domain.Enums;

namespace Investment.Application.DTOs.Response
{
    public class AssetResponseDto
    {
        public int Id { get; set; }
        public string TickerSymbol { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public AssetType Type { get; set; }
        public decimal CurrentPrice { get; set; }
    }
}
