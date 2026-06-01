using System;

namespace Investment.Application.DTOs.Response
{
    public class LoginResponseDto
    {
        public int UserId { get; set; }
        public string Token { get; set; } = string.Empty;         // Ye Access Token hai
        public string RefreshToken { get; set; } = string.Empty;  // 🔥 Naya Refresh Token
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
    }
}