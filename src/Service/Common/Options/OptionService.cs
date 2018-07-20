using System.Collections.Generic;
using System.Linq;
using Model;

namespace Service.Common.Options
{
    /// <summary>
    ///     This service returns static lists to populate
    ///     dropdowns and other option pickers.
    ///     Should return things like States, Countries, etc.
    /// </summary>
    public interface IOptionService
    {
        IEnumerable<PhoneType> GetPhoneTypes();
        IEnumerable<State> GetStates();
        IEnumerable<Country> GetCountries();

        IEnumerable<ContactStatus> GetContactStatuses();
    }

    public class OptionService : IOptionService 
    {
        protected IPrimaryContext Context;

        public OptionService(IPrimaryContext context)
        {
            Context = context;
        }

        public IEnumerable<PhoneType> GetPhoneTypes()
        {
            return GetAll<PhoneType>();
        }

        public IEnumerable<State> GetStates()
        {
            return GetAll<State>();
        }

        public IEnumerable<Country> GetCountries()
        {
            return GetAll<Country>();
        }


        public IEnumerable<ContactStatus> GetContactStatuses()
        {
            return GetAll<ContactStatus>();
        }

        private IEnumerable<T> GetAll<T>() where T : BaseEntity
        {
            return Context.Set<T>().AsEnumerable();
        }

        
    }
}
