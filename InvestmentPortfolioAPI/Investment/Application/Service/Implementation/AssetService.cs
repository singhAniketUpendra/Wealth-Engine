using AutoMapper;
using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;
using Investment.Application.Repository.Interfaces;
using Investment.Application.Service.Interface;
using Investment.Domain.Entities;
using Investment.Domain.Enums;

namespace Investment.Application.Service.Implementation
{
    public class AssetService : IAssetService
    {
        private readonly IAssetRepository _assetRepo;
        private readonly IMapper _mapper;

        public AssetService(IAssetRepository assetRepo, IMapper mapper)
        {
            _assetRepo = assetRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AssetResponseDto>> GetAllAssetsAsync()
        {
            var assets = await _assetRepo.GetAllAsync();
            return _mapper.Map<IEnumerable<AssetResponseDto>>(assets);
        }

        public async Task<AssetResponseDto?> GetAssetByIdAsync(int id)
        {
            var asset = await _assetRepo.GetByIdAsync(id);
            return _mapper.Map<AssetResponseDto>(asset);
        }

        public async Task<AssetResponseDto> AddAssetAsync(AssetRequestDto request)
        {
            var asset = _mapper.Map<Asset>(request);
            await _assetRepo.AddAsync(asset);
            return _mapper.Map<AssetResponseDto>(asset);
        }

        public async Task<IEnumerable<AssetResponseDto>> GetAssetsByTypeAsync(AssetType type)
        {
            var assets = await _assetRepo.GetByTypeAsync(type);
            return _mapper.Map<IEnumerable<AssetResponseDto>>(assets);
        }

        public async Task<AssetResponseDto> UpdateAssetAsync(int id, AssetRequestDto request)
        {
            var existingAsset = await _assetRepo.GetByIdAsync(id);
            if (existingAsset == null) throw new Exception("Asset not found");

            // Map request DTO values to the existing entity
            _mapper.Map(request, existingAsset);

            await _assetRepo.UpdateAsync(existingAsset);

            return _mapper.Map<AssetResponseDto>(existingAsset);
        }

        public async Task<bool> DeleteAssetAsync(int id)
        {
            var asset = await _assetRepo.GetByIdAsync(id);
            if (asset == null) return false;

            // The repository handles the IsActive = false logic
            await _assetRepo.DeleteAsync(id);
            return true;
        }
    }
}
