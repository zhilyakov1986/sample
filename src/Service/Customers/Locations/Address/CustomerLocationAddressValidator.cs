using FluentValidation;
using Model;
using Service.Utilities.Validators;


namespace Service.CustomerLocations.Address
{
    internal class CustomerLocationAddressValidator: AbstractValidator<CustomerLocationAddress>
    {
        public CustomerLocationAddressValidator(AddressValidator av)
        {
            RuleFor(ca => ca.Address).SetValidator(av);
        }
    }
}
