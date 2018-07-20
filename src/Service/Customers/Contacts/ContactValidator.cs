using FluentValidation;
using Model;
using Service.Utilities;
using Service.Utilities.Validators;

namespace Service.Customers.Contacts
{
    public class ContactValidator : AbstractValidator<Contact>
    {
        public ContactValidator()
        {
            RuleFor(cc => cc.FirstName).NotEmpty().Length(0, 50);
            RuleFor(cc => cc.LastName).NotEmpty().Length(0, 50);
            RuleFor(cc => cc.Title).Length(0, 50);
            RuleFor(cc => cc.Email)
                .Must(ValidatorHelpers.BeAnEmptyOrValidEmail)
                .WithMessage("Email must be valid if present.");
            RuleFor(cc => cc.StatusId).NotEmpty();
            RuleFor(cc => cc.Address)
                .SetValidator(new AddressValidator())
                .When(ca => ca.Address != null);
        }
    }
}
