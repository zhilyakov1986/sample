using System.Linq;
using FluentValidation;
using Model;

namespace Service.Customers.Sources
{
    internal class CustomerSourceValidator : AbstractValidator<CustomerSource>
    {
        protected IPrimaryContext Context;
        public CustomerSourceValidator(IPrimaryContext context) {
            Context = context;
            RuleFor(s => s.Name)
                .NotEmpty()
                .Length(0, 50);

            RuleFor(s => s.Name)
                .NotEmpty()
                .Length(0, 50)
                .Must(BeAUniqueSourceName)
                .WithMessage("There are duplicate Customer Source names.");
        }

        public bool BeAUniqueSourceName(CustomerSource source, string name) {
            return !Context.CustomerSources.Any(s => s.Name == name && s.Id != source.Id);
        }
    }
}
