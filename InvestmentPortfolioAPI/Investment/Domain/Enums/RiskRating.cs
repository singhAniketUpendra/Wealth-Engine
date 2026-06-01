namespace Investment.Domain.Enums
{
    public enum RiskRating
    {
        Conservative = 1,  // Low Risk (Bonds, FDs)
        Balanced = 2,      // Moderate Risk (Mix of Stocks & Bonds)
        Aggressive = 3,    // High Risk (Growth Stocks, Large Cap)
        Speculative = 4    // Very High Risk (Crypto, Penny Stocks)
    }
}
