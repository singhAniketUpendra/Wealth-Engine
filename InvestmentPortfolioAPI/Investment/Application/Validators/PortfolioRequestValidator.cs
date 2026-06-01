using FluentValidation;
using Investment.Application.DTOs.Request;

namespace Investment.Application.Validators
{
    public class PortfolioRequestValidator : AbstractValidator<PortfolioRequestDto>
    {
        public PortfolioRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Portfolio name is required")
                .MaximumLength(100);

            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");
        }
    }
}
