using FluentValidation;
using Investment.Application.DTOs.Request;

namespace Investment.Application.Validators
{
    public class TransactionRequestValidator : AbstractValidator<TransactionRequestDto>
    {
        public TransactionRequestValidator()
        {
            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than 0");

            RuleFor(x => x.PriceAtTransaction)
                .GreaterThan(0).WithMessage("Transaction price must be positive");

            RuleFor(x => x.PortfolioId).NotEmpty();
            RuleFor(x => x.AssetId).NotEmpty();

            // Ensure the type is a valid enum value
            RuleFor(x => x.Type).IsInEnum();
        }
    }
}
