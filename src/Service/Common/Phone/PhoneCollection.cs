using System.Collections.Generic;
using Model;

namespace Service.Common.Phone
{
    public class PhoneCollection<T> where T : IHasPhoneNumber
    {
        public IEnumerable<T> Phones { get; set; }
    }
}
