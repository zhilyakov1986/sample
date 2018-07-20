using FluentValidation;
using Model;
using System.Linq;

namespace Service.CustomerLocations
{
    internal class CustomerLocationValidator : AbstractValidator<CustomerLocation>
    {
        protected IPrimaryContext Context;
        public CustomerLocationValidator(IPrimaryContext context)
        {
            RuleFor(cl => cl.Name)
                .NotEmpty()
                .WithName("Location Name")
                .WithMessage("Location Name is required")
                .Length(0, 50)
                .WithMessage("Location name must be less then 50 characters");
        }
    }
}
