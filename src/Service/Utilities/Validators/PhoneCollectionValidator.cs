using FluentValidation;
using Model;
using Service.Common.Phone;

namespace Service.Utilities.Validators
{
    public class PhoneCollectionValidator<T> : AbstractValidator<PhoneCollection<T>> where T : IHasPhoneNumber
    {
        internal PhoneCollectionValidator(PhoneValidator<T> phoneValidator)
        {
            RuleFor(upc => upc.Phones)
                .Must(ValidatorHelpers.HaveAtMostOnePrimaryPhoneNumber)
                .SetCollectionValidator(phoneValidator);
        }
    }
}
