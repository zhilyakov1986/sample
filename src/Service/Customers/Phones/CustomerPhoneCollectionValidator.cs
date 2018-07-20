using Model;
using Service.Utilities.Validators;

namespace Service.Customers.Phone
{
    internal class CustomerPhoneCollectionValidator : PhoneCollectionValidator<CustomerPhone>
    {
        internal CustomerPhoneCollectionValidator()
            : base(new CustomerPhoneValidator())
        { }
    }
}
