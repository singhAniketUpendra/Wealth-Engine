namespace Investment.Application.DTOs.Response
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // Frontend ko dikhane ke liye string format mein
    }
}
