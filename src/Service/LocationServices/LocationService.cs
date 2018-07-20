using FluentValidation;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.Base;
using System.Linq.Expressions;
using System.Data.Entity;

namespace Service.LocationServices
{
    public class LocationService: BaseService, ILocationService
    {
        private readonly IValidator<Model.LocationService> _locationServiceValidator;
        public LocationService(IPrimaryContext context)
            : base(context)
        {
            _locationServiceValidator = new LocationServiceValidator(context);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="locationServiceId"></param>
        public void DeleteLocationService(int locationServiceId)
        {
            var locationService = Context.LocationServices.Where(ls => ls.Id == locationServiceId).FirstOrDefault();
            Context.LocationServices.Remove(locationService);
            Context.SaveChanges();

        }

       /// <summary>
       /// 
       /// </summary>
       /// <param name="locationServiceId"></param>
       /// <returns></returns>
       public Model.LocationService GetCustomServiceLocation(int locationServiceId)
        {
            return Context.LocationServices
                .Where(ls => ls.Id == locationServiceId)
                .Include(ls=>ls.Good)
                .FirstOrDefault();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="locationId"></param>
        /// <returns></returns>
        public List<Model.LocationService> GetServicesForLocation(int locationId)
        {
            return Context.LocationServices
                .Where(ls => ls.CustomerLocationId == locationId)
                .Include(ls => ls.Good)
                .ToList();

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="addressId"></param>
        /// <returns></returns>
        public decimal GetStateTaxRate(int? addressId)
        {
            var currentStateId = Context.Addresses.FirstOrDefault(a => a.Id == addressId).StateId;
            return (decimal)Context.States.FirstOrDefault(s => s.Id == currentStateId).TaxRate;
        }      

        /// <summary>
        /// 
        /// </summary>
        /// <param name="locationServiceId"></param>
        /// <returns></returns>
        public decimal GetTaxForService(int locationServiceId)
        {
            var currentLocationService = Context.LocationServices.Where(cl => cl.Id == locationServiceId).Include(cl => cl.Good).FirstOrDefault();
            var currentLocationStateTaxRate = GetTaxRateForLocation(currentLocationService.CustomerLocationId);
            return currentLocationService.Good.Taxable ? currentLocationService.Price * currentLocationService.Quantity * currentLocationStateTaxRate : 0;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public Dictionary<int, decimal> GetAllTaxes()
        {
            var allLocationServices = Context.LocationServices.ToList();
            var calculatedTaxes = new Dictionary<int, decimal> {};
            foreach(var item in allLocationServices)
            {
                calculatedTaxes[item.Id] = GetTaxForService(item.Id);
            }
            return calculatedTaxes;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public Dictionary<int, decimal> GetAllTotals()
        {
            var allLocationServices = Context.LocationServices.ToList();
            var calculatedTotals = new Dictionary<int, decimal> { };
            foreach (var item in allLocationServices)
            {
                calculatedTotals[item.Id] = GetTotalLineItem(item.Id);
            }
            return calculatedTotals;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="locationId"></param>
        /// <returns></returns>
        public decimal GetTaxRateForLocation(int locationId)
        {
            CustomerLocation currentLocation = Context.CustomerLocations.FirstOrDefault(cl => cl.Id == locationId);
            return GetStateTaxRate(currentLocation.AddressId);           
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="locationId"></param>
        /// <returns></returns>
        public decimal GetTotal(int locationId)
        {
            var currentLocationStateTaxRate = GetTaxRateForLocation(locationId);
            decimal totalForLocation = 0;
            var servicesForLocation = GetServicesForLocation(locationId);
            for (int i = 0; i < servicesForLocation.Count; i++)
            {
                totalForLocation += GetTotalLineItem(servicesForLocation[i].Id);
            }
            return totalForLocation;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="locationServiceId"></param>
        /// <returns></returns>
        public decimal GetTotalLineItem(int locationServiceId)
        {
            Model.LocationService currentLocationService = Context.LocationServices.FirstOrDefault(cl => cl.Id == locationServiceId);
            var taxForService = GetTaxForService(locationServiceId);
            return currentLocationService.Price * currentLocationService.Quantity + taxForService;

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="locationId"></param>
        public void ToggleArchive(int locationId)
        {
            var selectedLocation = Context.LocationServices
                .Where(ls => ls.CustomerLocationId == locationId).ToList();
            for (int i = 0; i< selectedLocation.Count; i++)
            {
                selectedLocation[i].Archived = !selectedLocation[i].Archived;
            }
            //Context.SetEntityState(selectedLocation, EntityState.Modified);
            Context.SaveChanges();
        }
   
    }
}
