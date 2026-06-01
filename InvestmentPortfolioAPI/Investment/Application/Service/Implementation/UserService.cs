using AutoMapper;
using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;
using Investment.Application.Repository.Interfaces;
using Investment.Application.Service.Interface;
using Investment.Domain.Entities;
using Investment.Domain.Enums;

namespace Investment.Application.Service.Implementation
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepo, IMapper mapper)
        {
            _userRepo = userRepo;
            _mapper = mapper;
        }

        public async Task<UserResponseDto> RegisterUserAsync(UserRequestDto request)
        {
            var existingUser = await _userRepo.GetByEmailAsync(request.Email.Trim());
            if (existingUser != null)
            {
                throw new Exception("This email address is already registered.");
            }

            var user = _mapper.Map<User>(request);
            user.Email = request.Email.Trim();
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            user.Role = request.Role == 1 ? UserRole.Admin : UserRole.User; // 1 = Admin, Default parameters match
            user.IsDeleted = false;

            await _userRepo.AddAsync(user);
            return _mapper.Map<UserResponseDto>(user);
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepo.GetByIdAsync(id);
            return _mapper.Map<UserResponseDto>(user);
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _userRepo.GetAllAsync();
            return _mapper.Map<IEnumerable<UserResponseDto>>(users);
        }

        // 🔥 FIXED: Accept the optimized UserUpdateRequestDto profile structure safely
        public async Task<UserResponseDto> UpdateUserAsync(int id, UserUpdateRequestDto request)
        {
            // 1. Database se existing user entity uthao
            var existingUser = await _userRepo.GetByIdAsync(id);
            if (existingUser == null) throw new Exception("User not found");

            // 2. Check if the NEW email is being used by ANY OTHER user entity block
            if (!string.Equals(existingUser.Email, request.Email, StringComparison.OrdinalIgnoreCase))
            {
                var userWithNewEmail = await _userRepo.GetByEmailAsync(request.Email.Trim());
                if (userWithNewEmail != null && userWithNewEmail.Id != id)
                {
                    throw new Exception("Cannot update profile. The new email address is already taken.");
                }
            }

            // 3. Map updated fields directly over the tracking object
            // Password is not in UserUpdateRequestDto, so it will remain absolutely untouched!
            _mapper.Map(request, existingUser);
            existingUser.Email = request.Email.Trim(); // Formatting clean look

            // 4. Update the security role enum tracking accurately based on frontend code input (1 = Admin, 2 = User)
            existingUser.Role = request.Role == 1 ? UserRole.Admin : UserRole.User;

            await _userRepo.UpdateAsync(existingUser);

            return _mapper.Map<UserResponseDto>(existingUser);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null) return false;

            await _userRepo.DeleteAsync(id);
            return true;
        }
    }
}