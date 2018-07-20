using FluentValidation;
using Model;

namespace Service.Customers
{
    internal class CustomerValidator : AbstractValidator<Customer>
    {
        public CustomerValidator()
        {
            RuleFor(c => c.Name)
                .NotEmpty()
                .WithName("Customer Name")
                .WithMessage("Customer Name is Required")
                .Length(0, 50)
                .WithMessage("Customer name must be less than 50 characters");
            RuleFor(c => c.SourceId).NotEmpty().WithMessage("Source is required");
            RuleFor(c => c.StatusId).NotEmpty().WithMessage("Status is required");
        }
    }
}