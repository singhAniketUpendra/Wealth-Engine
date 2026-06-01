using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;
using Investment.Domain.Enums;

namespace Investment.Application.Service.Interface
{
    public interface IAssetService
    {
        Task<IEnumerable<AssetResponseDto>> GetAllAssetsAsync();
        Task<AssetResponseDto?> GetAssetByIdAsync(int id);
        Task<IEnumerable<AssetResponseDto>> GetAssetsByTypeAsync(AssetType type); 
        Task<AssetResponseDto> AddAssetAsync(AssetRequestDto request);
        Task<AssetResponseDto> UpdateAssetAsync(int id, AssetRequestDto request);
        Task<bool> DeleteAssetAsync(int id);
    }
}