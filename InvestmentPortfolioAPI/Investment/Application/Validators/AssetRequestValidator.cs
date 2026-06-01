using FluentValidation;
using Investment.Application.DTOs.Request;

namespace Investment.Application.Validators
{
    public class AssetRequestValidator : AbstractValidator<AssetRequestDto>
    {
        public AssetRequestValidator()
        {
            RuleFor(x => x.TickerSymbol)
                .NotEmpty().WithMessage("Ticker symbol is required")
                .MaximumLength(10).WithMessage("Ticker cannot exceed 10 characters")
                .Must(x => x == x.ToUpper()).WithMessage("Ticker must be uppercase (e.g., AAPL)");

            RuleFor(x => x.AssetName)
                .NotEmpty().WithMessage("Asset name is required");

            RuleFor(x => x.CurrentPrice)
                .GreaterThan(0).WithMessage("Price must be greater than zero");
        }
    }
}
