using System.Security.Claims;
using System.Threading.Tasks;
using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;
using Investment.Domain.Enums;

namespace Investment.Application.Service.Interface
{
    public interface IAuthService
    {
        string GenerateToken(int userId, string username, UserRole role);
        string GenerateRefreshToken(); // 🔥 Naya method
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token); // 🔥 Token validation ke liye
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request); // 🔥 Pura Login handle karne ke liye
        Task<LoginResponseDto> RefreshTokenAsync(TokenRequestDto request); // 🔥 Token refresh karne ke liye
    }
}