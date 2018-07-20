using Model;
using Service.Common.Address;
using System.Collections.Generic;
using System.Linq;

namespace Service.LocationServices
{
    public interface ILocationService
    {
        decimal GetStateTaxRate(int? addressId);
        List<Model.LocationService> GetServicesForLocation(int locationId);
        void DeleteLocationService(int locationServiceId);
        Model.LocationService GetCustomServiceLocation(int locationServiceId);
        decimal GetTotal(int locationId);
        void ToggleArchive(int locationId);
        decimal GetTotalLineItem(int locationServiceId);
        decimal GetTaxForService(int locationServiceId);
        decimal GetTaxRateForLocation(int locationId);
        Dictionary<int, decimal> GetAllTaxes();
        Dictionary<int, decimal> GetAllTotals();
    }
}
