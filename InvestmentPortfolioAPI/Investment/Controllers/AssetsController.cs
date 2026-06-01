using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;
using Investment.Application.Service.Interface;
using Investment.Domain.Enums;
using Microsoft.AspNetCore.Authorization; // 🔥 Security ke liye zaroori
using Microsoft.AspNetCore.Mvc;

namespace Investment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssetsController : ControllerBase
    {
        private readonly IAssetService _assetService;

        public AssetsController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        // Everyone: Bina login ke bhi koi bhi rates dekh sake
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssetResponseDto>>> GetAll()
        {
            var assets = await _assetService.GetAllAssetsAsync();
            return Ok(assets);
        }

        // Everyone: Specific asset ki details public honi chahiye
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<AssetResponseDto>> GetById(int id)
        {
            var asset = await _assetService.GetAssetByIdAsync(id);
            if (asset == null) return NotFound();

            return Ok(asset);
        }

        // Admin Only: Naya asset sirf Admin add karega
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<AssetResponseDto>> Create(AssetRequestDto request)
        {
            var createdAsset = await _assetService.AddAssetAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = createdAsset.Id }, createdAsset);
        }

        // Everyone: Filter assets by type (e.g., /api/assets/type/1)
        [AllowAnonymous]
        [HttpGet("type/{type}")]
        public async Task<ActionResult<IEnumerable<AssetResponseDto>>> GetByType(AssetType type)
        {
            var assets = await _assetService.GetAssetsByTypeAsync(type);
            return Ok(assets);
        }

        // Admin Only: Asset details update karna Admin ka kaam hai
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AssetRequestDto request)
        {
            // Note: Try-catch ki ab zaroorat nahi hai agar tumne Middleware setup kar liya hai
            var updatedAsset = await _assetService.UpdateAssetAsync(id, request);
            return Ok(updatedAsset);
        }

        // Admin Only: Delete power sirf Admin ke paas
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _assetService.DeleteAssetAsync(id);
            if (!result) return NotFound();

            return NoContent();
        }
    }
}