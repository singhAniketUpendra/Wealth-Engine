using AutoMapper;
using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;
using Investment.Application.Repository.Interfaces;
using Investment.Application.Service.Interface;
using Investment.Domain.Entities;
using Investment.Domain.Enums;

namespace Investment.Application.Service.Implementation
{
    public class PortfolioService : IPortfolioService
    {
        private readonly IPortfolioRepository _portfolioRepo;
        private readonly IMapper _mapper;

        public PortfolioService(IPortfolioRepository portfolioRepo, IMapper mapper)
        {
            _portfolioRepo = portfolioRepo;
            _mapper = mapper;
        }

        public async Task<PortfolioResponseDto> CreatePortfolioAsync(PortfolioRequestDto request)
        {
            var portfolio = _mapper.Map<Portfolio>(request);
            await _portfolioRepo.AddAsync(portfolio);
            return _mapper.Map<PortfolioResponseDto>(portfolio);
        }

        public async Task<PortfolioResponseDto?> GetPortfolioByIdAsync(int id)
        {
            var portfolio = await _portfolioRepo.GetByIdWithTransactionsAsync(id);
            if (portfolio == null) return null;
            return _mapper.Map<PortfolioResponseDto>(portfolio);
        }

        public async Task<IEnumerable<PortfolioResponseDto>> GetUserPortfoliosAsync(int userId)
        {
            var portfolios = await _portfolioRepo.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<PortfolioResponseDto>>(portfolios);
        }

        // 🔥 Naya Profit/Loss & Asset-wise Breakdown Calculation Logic
        public async Task<PortfolioSummaryDto> GetPortfolioSummaryAsync(int id)
        {
            // 1. Fetch portfolio with its transactions and asset details
            var portfolio = await _portfolioRepo.GetByIdWithTransactionsAsync(id);
            if (portfolio == null) throw new Exception("Portfolio not found");

            decimal totalInvested = 0;
            decimal currentValue = 0;
            decimal totalWeightedRisk = 0; // Risk calculation ke liye accumulator
            var assetBreakdownList = new List<AssetHoldingDto>();

            // 2. Group transactions by AssetId
            var groupedTransactions = portfolio.Transactions.GroupBy(t => t.AssetId);

            foreach (var group in groupedTransactions)
            {
                var firstTx = group.First();
                decimal netQuantity = 0;
                decimal totalBuyCost = 0;
                decimal totalBuyQuantity = 0;
                decimal currentPrice = firstTx.Asset.CurrentPrice;

                // Step A: Pehle saare BUYs ka total nikalenge taaki accurate Average Buy Price (Cost Basis) mile
                foreach (var transaction in group.Where(t => t.Type == TransactionType.Buy))
                {
                    netQuantity += transaction.Quantity;
                    totalBuyQuantity += transaction.Quantity;
                    totalBuyCost += (transaction.Quantity * transaction.PriceAtTransaction);
                }

                // Calculate Average Buy Price
                decimal avgBuyPrice = totalBuyQuantity > 0 ? (totalBuyCost / totalBuyQuantity) : 0;

                // Step B: Ab SELLs ko handle karenge based on Average Buy Price (Not the Sell Price!)
                foreach (var transaction in group.Where(t => t.Type == TransactionType.Sell))
                {
                    netQuantity -= transaction.Quantity;
                }

                // Real Invested Cost = Jo bachi hui quantity hai * uski average khareed keemat
                decimal assetInvestedCost = netQuantity * avgBuyPrice;
                if (assetInvestedCost < 0) assetInvestedCost = 0;

                // Step C: Individual Asset Performance Calculations
                decimal assetCurrentValue = netQuantity * currentPrice;
                decimal assetProfitLoss = assetCurrentValue - assetInvestedCost;
                decimal assetProfitLossPercentage = assetInvestedCost > 0 ? (assetProfitLoss / assetInvestedCost) * 100 : 0;

                // List mein tabhi add karenge jab user ke paas sach mein holdings bachi hon
                if (netQuantity > 0 || assetInvestedCost > 0)
                {
                    assetBreakdownList.Add(new AssetHoldingDto
                    {
                        AssetId = group.Key,
                        TickerSymbol = firstTx.Asset.TickerSymbol,
                        AssetName = firstTx.Asset.AssetName,
                        NetQuantity = Math.Round(netQuantity, 4),
                        AvgBuyPrice = Math.Round(avgBuyPrice, 2),
                        TotalInvested = Math.Round(assetInvestedCost, 2),
                        CurrentValue = Math.Round(assetCurrentValue, 2),
                        ProfitLoss = Math.Round(assetProfitLoss, 2),
                        ProfitLossPercentage = Math.Round(assetProfitLossPercentage, 2)
                    });

                    // Step D: Risk Assessment Logic for this individual asset
                    decimal assetRiskWeight = 2; // Default: Low Risk (Fixed Income)

                    if (firstTx.Asset.Type == AssetType.Crypto)
                        assetRiskWeight = 10; // High Risk
                    else if (firstTx.Asset.Type == AssetType.Equity)
                        assetRiskWeight = 6;  // Medium Risk

                    // Add to weighted risk accumulator (Asset Value Share * Asset Risk Weight)
                    totalWeightedRisk += assetInvestedCost * assetRiskWeight;
                }

                // Global Portfolio Totals accumulate karo
                totalInvested += assetInvestedCost;
                currentValue += assetCurrentValue;
            }

            // 3. Overall Portfolio Calculations
            decimal totalProfitLoss = currentValue - totalInvested;
            decimal profitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

            // 4. Final Risk Level Determination based on Weighted Average
            decimal finalPortfolioRiskScore = totalInvested > 0 ? (totalWeightedRisk / totalInvested) : 0;

            RiskRating finalRiskLevel = RiskRating.Balanced; // Default fallback
            if (finalPortfolioRiskScore <= 3)
                finalRiskLevel = RiskRating.Conservative;
            else if (finalPortfolioRiskScore <= 6)
                finalRiskLevel = RiskRating.Balanced;
            else if (finalPortfolioRiskScore <= 8)
                finalRiskLevel = RiskRating.Aggressive;
            else
                finalRiskLevel = RiskRating.Speculative;

            // 5. Return the full dashboard package
            return new PortfolioSummaryDto
            {
                PortfolioId = portfolio.Id,
                PortfolioName = portfolio.Name,
                TotalInvested = Math.Round(totalInvested, 2),
                CurrentValue = Math.Round(currentValue, 2),
                TotalProfitLoss = Math.Round(totalProfitLoss, 2),
                ProfitLossPercentage = Math.Round(profitLossPercentage, 2),
                RiskLevel = finalRiskLevel,
                PortfolioRiskScore = Math.Round(finalPortfolioRiskScore, 2),
                AssetBreakdown = assetBreakdownList
            };
        }
        public async Task<PortfolioResponseDto> UpdatePortfolioAsync(int id, PortfolioRequestDto request)
        {
            var existingPortfolio = await _portfolioRepo.GetByIdWithTransactionsAsync(id);
            if (existingPortfolio == null) throw new Exception("Portfolio not found");

            _mapper.Map(request, existingPortfolio);
            await _portfolioRepo.UpdateAsync(existingPortfolio);

            return _mapper.Map<PortfolioResponseDto>(existingPortfolio);
        }

        public async Task<bool> DeletePortfolioAsync(int id)
        {
            var portfolio = await _portfolioRepo.GetByIdWithTransactionsAsync(id);
            if (portfolio == null) return false;

            await _portfolioRepo.DeleteAsync(id);
            return true;
        }
    }
}