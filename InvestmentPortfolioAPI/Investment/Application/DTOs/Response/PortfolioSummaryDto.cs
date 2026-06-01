using Investment.Domain.Enums;
using System.Collections.Generic;

namespace Investment.Application.DTOs.Response
{
    public class PortfolioSummaryDto
    {
        public int PortfolioId { get; set; }
        public string PortfolioName { get; set; } = string.Empty;
        public decimal TotalInvested { get; set; }      // Pure portfolio mein kitna lagaya
        public decimal CurrentValue { get; set; }       // Pure portfolio ki aaj ki total value
        public decimal TotalProfitLoss { get; set; }     // Kul munafa ya nuksaan
        public decimal ProfitLossPercentage { get; set; } // Overall Returns %

        public RiskRating RiskLevel { get; set; }
        public decimal PortfolioRiskScore { get; set; }

        // Assets ka individual breakdown list
        public List<AssetHoldingDto> AssetBreakdown { get; set; } = new List<AssetHoldingDto>();
    }
}