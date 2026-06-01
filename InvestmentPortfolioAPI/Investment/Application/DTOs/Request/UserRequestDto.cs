namespace Investment.Application.DTOs.Request
{
    public class UserRequestDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // Registration ke waqt password chahiye
        public int Role { get; set; } = 1; // 1 = User
    }
}
