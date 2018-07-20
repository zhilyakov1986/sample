using Model;
using Service.Utilities.Validators;

namespace Service.Customers.Contacts
{
    internal class ContactPhoneCollectionValidator : PhoneCollectionValidator<ContactPhone>
    {
        internal ContactPhoneCollectionValidator()
            : base(new ContactPhoneValidator())
        { }
    }
}
