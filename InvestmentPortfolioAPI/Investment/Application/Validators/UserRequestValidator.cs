using FluentValidation;
using Investment.Application.DTOs.Request;

namespace Investment.Application.Validators
{
    public class UserRequestValidator : AbstractValidator<UserRequestDto>
    {
        public UserRequestValidator()
        {
            RuleFor(x => x.Username)
             .NotEmpty().WithMessage("Username is required")
             .MinimumLength(3);

            RuleFor(x => x.Email)
                .NotEmpty().EmailAddress();

            RuleFor(x => x.Password)
                .NotEmpty().MinimumLength(6).WithMessage("Password must be at least 6 characters");

            RuleFor(x => x.Role)
                .InclusiveBetween(0, 2).WithMessage("Invalid Role assigned");
        }
    }
}
