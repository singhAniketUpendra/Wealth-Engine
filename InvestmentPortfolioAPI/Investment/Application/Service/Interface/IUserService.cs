using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;

namespace Investment.Application.Service.Interface
{
    public interface IUserService
    {
        Task<UserResponseDto> RegisterUserAsync(UserRequestDto request);
        Task<UserResponseDto?> GetUserByIdAsync(int id);
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();

        // 🔥 FIXED: Changed data contract parameter from UserRequestDto to UserUpdateRequestDto
        Task<UserResponseDto> UpdateUserAsync(int id, UserUpdateRequestDto request);
        Task<bool> DeleteUserAsync(int id);
    }
}