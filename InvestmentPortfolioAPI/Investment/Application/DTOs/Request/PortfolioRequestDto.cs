namespace Investment.Application.DTOs.Request
{
    public class PortfolioRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}
