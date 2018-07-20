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

namespace Service.Contracts
{
    public class ContractService : BaseService, IContractService
    {
        private readonly IValidator<Contract> _contractValidator;
        public ContractService(IPrimaryContext context)
            : base(context)
        {
            _contractValidator = new ContractValidator(context);
        }
        #region non-crud logic
        /// <summary>
        ///  generates contract number
        /// </summary>
        /// <param name="customerId"></param>
        /// <returns></returns>
        public string GenereateContractNumber(int customerId)
        {
            var customerIdPart = customerId.ToString().PadLeft(4, '0');
            var totalContractsPart = TotalOrdersForCustomerPlusOne(customerId).ToString().PadLeft(6, '0');
            return $"CO-{customerIdPart}-{totalContractsPart}";
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="customerId"></param>
        /// <returns></returns>
        public IQueryable<CustomerLocation> GetLocationForCustomer(int customerId)
        {
            return Context.CustomerLocations
                .Where(cl => cl.CustomerId == customerId);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="customerId"></param>
        /// <returns></returns>
        public int TotalOrdersForCustomerPlusOne(int customerId)
        {
            var totalOrders = Context.Contracts
                .Where(c => c.CustomerId == customerId).Count();
            return totalOrders + 1;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public int GetUserRole(int userId)
        {
            var currentUserAuthId = Context.Users.FirstOrDefault(u => u.Id == userId).AuthUserId;
            return Context.AuthUsers.FirstOrDefault(au => au.Id == currentUserAuthId).RoleId;

        }
        #endregion

        #region create and update overwrite for CRUD

        /// <summary>
        /// Creates a row in the database for the entity T
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data">The entity to attach</param>
        public int CreateContract(Contract contract)
        {
            ThrowIfNull(contract);
            //pulling out servcie areas
            var dbServiceAreas = contract.ServiceAreas;

            //clearing out the assciations if present
            //set all foreign key to null
            contract.ContractStatus = null;
            contract.Customer = null;
            contract.ServiceDivision = null;
            contract.User = null;

            //set to null many-to-many table
            var dbServiceAreasList = dbServiceAreas.ToList();
            foreach (var sa in dbServiceAreasList)
            {
                // remove
                if (contract.ServiceAreas.Any(item => item.Id == sa.Id))
                {
                    contract.ServiceAreas.Remove(sa);
                }
            }            
            Context.Contracts.Add(contract);

            // reatach the service areas back to the contract
            foreach (var sa in dbServiceAreasList)
            {
                // add
                if (!dbServiceAreas.Any(item => item.Id == sa.Id))
                {
                    Context.ServiceAreas.Attach(sa);
                    contract.ServiceAreas.Add(sa);
                }
            }
            Context.SaveChanges();
            return contract.Id;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="contract"></param>
        /// <returns></returns>
        public byte[] UpdateContract(Contract contract)
        {
            
            // update
            var dbContract = Context.Contracts.Include(c => c.ServiceAreas).FirstOrDefault(c => c.Id == contract.Id);
            // add all of the other property assigns here
            dbContract.Archived = contract.Archived;
            dbContract.ContractStatus = contract.ContractStatus;
            dbContract.CustomerId = contract.CustomerId;
            //dbContract.Id = dbContract.Id;
            dbContract.ServiceDivisionId = contract.ServiceDivisionId;
            dbContract.EndDate = contract.EndDate;
            dbContract.StartDate = contract.StartDate;
            //dbContract.UserId = contract.UserId;
            dbContract.StatusId = contract.StatusId;

            var dbServiceAreas = dbContract.ServiceAreas.ToList();
            foreach (var sa in dbServiceAreas)
            {
                // remove
                if (!contract.ServiceAreas.Any(item => item.Id == sa.Id))
                {
                    dbContract.ServiceAreas.Remove(sa);
                }
            }
            foreach (var sa in contract.ServiceAreas)
            {
                // add
                if (!dbServiceAreas.Any(item => item.Id == sa.Id))
                {
                    Context.ServiceAreas.Attach(sa);
                    dbContract.ServiceAreas.Add(sa);
                }
            }
            Context.SaveChanges();
            return contract.Version;
        }
    }
}
#endregion
