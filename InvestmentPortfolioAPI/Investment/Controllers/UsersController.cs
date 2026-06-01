using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;
using Investment.Application.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Investment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // Admin Only: Saare users ki list dekhne ke liye
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // User & Admin: Profile check karne ke liye
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();

            return Ok(user);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserResponseDto>> Register([FromBody] UserRequestDto request)
        {
            var createdUser = await _userService.RegisterUserAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = createdUser.Id }, createdUser);
        }

        // 🔥 FIXED: Profile update endpoint using the new UserUpdateRequestDto
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UserUpdateRequestDto request)
        {
            // Strict REST Validation: Route parameter must match model ID context
            if (id != request.Id)
            {
                return BadRequest("Mismatched route configuration parameter 'id' and payload context mapping.");
            }

            // Note: Make sure to update the method signature in IUserService/UserService to accept UserUpdateRequestDto!
            var updatedUser = await _userService.UpdateUserAsync(id, request);
            return Ok(updatedUser);
        }

        // Admin Only: Delete User Account
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result) return NotFound();

            return NoContent();
        }
    }
}