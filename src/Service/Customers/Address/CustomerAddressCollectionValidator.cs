using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using Model;
using Service.Utilities.Validators;

namespace Service.Customers.Address
{
    internal class CustomerAddressCollectionValidator : AbstractValidator<CustomerAddressCollection>
    {
        public CustomerAddressCollectionValidator()
        {
            RuleFor(c => c.CustomerAddresses).Must(HaveAtMostOnePrimaryAddress)
                .WithMessage("There can only be one primary address.")
                .SetCollectionValidator(new CustomerAddressValidator(new AddressValidator()));
        }

        private static bool HaveAtMostOnePrimaryAddress(IEnumerable<CustomerAddress> cas)
        {
            return cas == null || cas.Count(a => a.IsPrimary) <= 1;
        }
    }
}