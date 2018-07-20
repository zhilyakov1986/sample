using FluentValidation;
using Model;
using Service.Utilities.Validators;

namespace Service.Customers.Address
{
    internal class CustomerAddressValidator : AbstractValidator<CustomerAddress>
    {
        public CustomerAddressValidator(AddressValidator av)
        {
            RuleFor(ca => ca.Address).SetValidator(av);
        }
    }
}