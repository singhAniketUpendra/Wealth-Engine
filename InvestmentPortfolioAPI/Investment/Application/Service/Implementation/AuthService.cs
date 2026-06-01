using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;
using Investment.Application.Repository.Interfaces;
using Investment.Application.Service.Interface;
using Investment.Domain.Entities;
using Investment.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Investment.Application.Service.Implementation
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly IUserRepository _userRepo; // 🔥 User state update karne ke liye repo chahiye

        public AuthService(IConfiguration config, IUserRepository userRepo)
        {
            _config = config;
            _userRepo = userRepo;
        }

        // 1. Generate Short-Lived Access Token
        public string GenerateToken(int userId, string username, UserRole role)
        {
            var jwtKey = _config["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey)) throw new Exception("JWT Key is missing!");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim("UserId", userId.ToString()),
                new Claim(ClaimTypes.Role, role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(15), // 🔥 Access token ko short-lived kiya (15 mins)
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // 2. Generate Long-Lived Cryptographically Secure Refresh Token
        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        // 3. Extract Claims safely from an EXPIRED Access Token
        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var jwtKey = _config["Jwt:Key"];
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false, // Hamein bas claims chahiye, isliye baaki checks false hain
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                ValidateLifetime = false // 🔥 Yeh zaroori hai, kyunki token expire ho chuka hai!
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }

        // 4. Complete Login Flow
        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            var user = await _userRepo.GetByEmailAsync(request.Email);
            if (user == null) throw new Exception("Invalid Email or Password");

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!isPasswordValid) throw new Exception("Invalid Email or Password");

            var accessToken = GenerateToken(user.Id, user.Username, user.Role);
            var refreshToken = GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
            await _userRepo.UpdateAsync(user);

            return new LoginResponseDto
            {
                UserId = user.Id, // 🔥 FIX 1: Response mein asli User Id dalo!
                Token = accessToken,
                RefreshToken = refreshToken,
                Username = user.Username,
                Role = user.Role.ToString(),
                Expiration = DateTime.Now.AddMinutes(15)
            };
        }

        // 5. Refresh Token Logic
        public async Task<LoginResponseDto> RefreshTokenAsync(TokenRequestDto request)
        {
            var principal = GetPrincipalFromExpiredToken(request.AccessToken);
            var userIdClaim = principal.FindFirst("UserId")?.Value;
            if (userIdClaim == null) throw new Exception("Invalid token claims");

            var user = await _userRepo.GetByIdAsync(int.Parse(userIdClaim));

            if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                throw new Exception("Invalid or expired refresh token. Please login again.");
            }

            var newAccessToken = GenerateToken(user.Id, user.Username, user.Role);
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
            await _userRepo.UpdateAsync(user);

            return new LoginResponseDto
            {
                UserId = user.Id, // 🔥 FIX 2: Refresh token response mein bhi UserId map karo!
                Token = newAccessToken,
                RefreshToken = newRefreshToken,
                Username = user.Username,
                Role = user.Role.ToString(),
                Expiration = DateTime.Now.AddMinutes(15)
            };
         
        }
    }
}