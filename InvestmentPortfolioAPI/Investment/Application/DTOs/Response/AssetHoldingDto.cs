namespace Investment.Application.DTOs.Response
{
    public class AssetHoldingDto
    {
        public int AssetId { get; set; }
        public string TickerSymbol { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public decimal NetQuantity { get; set; }       // Total Kitne shares/crypto hain
        public decimal AvgBuyPrice { get; set; }       // Kis average rate pe khareeda
        public decimal TotalInvested { get; set; }     // Is asset mein kitna paisa lagaya
        public decimal CurrentValue { get; set; }      // Aaj iski kya value hai
        public decimal ProfitLoss { get; set; }        // Profit ya Loss (Absolute Amount)
        public decimal ProfitLossPercentage { get; set; } // Return % (e.g. +15.5 or -5.2)
    }
}