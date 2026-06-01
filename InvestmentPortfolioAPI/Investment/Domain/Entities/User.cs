using Investment.Domain.Enums;

namespace Investment.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.User;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime RefreshTokenExpiryTime { get; set; }

        public bool IsDeleted { get; set; } = false;
        public ICollection<Portfolio> Portfolios { get; set; } = new List<Portfolio>();
    }
}

