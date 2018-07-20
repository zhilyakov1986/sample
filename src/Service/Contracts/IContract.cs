using Model;
using Service.Common.Address;
using System.Linq;


namespace Service.Contracts
{
    public interface IContractService
    {
        IQueryable<CustomerLocation> GetLocationForCustomer(int customerId);
        int TotalOrdersForCustomerPlusOne(int customerId);
        string GenereateContractNumber(int customerId);
        int GetUserRole(int userId);
        byte[] UpdateContract(Contract contract);
        int CreateContract(Contract contract);
    }
}
