using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;

namespace Investment.Application.Service.Interface
{
    public interface IPortfolioService
    {
        Task<PortfolioResponseDto> CreatePortfolioAsync(PortfolioRequestDto request);
        Task<PortfolioResponseDto?> GetPortfolioByIdAsync(int id);
        Task<IEnumerable<PortfolioResponseDto>> GetUserPortfoliosAsync(int userId);

        Task<PortfolioResponseDto> UpdatePortfolioAsync(int id, PortfolioRequestDto request);

        Task<PortfolioSummaryDto> GetPortfolioSummaryAsync(int id);
        Task<bool> DeletePortfolioAsync(int id);
    }
}
