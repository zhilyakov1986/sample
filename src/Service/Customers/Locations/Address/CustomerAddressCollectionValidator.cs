using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using Model;
using Service.Utilities.Validators;

namespace Service.CustomerLocations.Address
{
    internal class CustomerLocationAddressCollectionValidator : AbstractValidator<CustomerLocationAddressCollection>
    {
       public CustomerLocationAddressCollectionValidator()
        {
            RuleFor(cl => cl.CustomerLocationAddresses).Must(HaveAtMostOnePrimaryAddress)
                 .WithMessage("There can only be one primary address.")
                  .SetCollectionValidator(new CustomerLocationAddressValidator(new AddressValidator()));
        }
        private static bool HaveAtMostOnePrimaryAddress(IEnumerable<CustomerLocationAddress> cas)
        {
            return cas == null || cas.Count(a => a.IsPrimary) <= 1;
        }
    }
}
