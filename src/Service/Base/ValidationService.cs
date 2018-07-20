using FluentValidation;
using Model;
using Service.Customers;
using System;
using Service.Customers.Contacts;
using Service.Customers.Sources;
using Service.Users;
using Service.Manage.States;
using Service.Goods;
using Service.Setup.ServiceAreas;
using Service.Setup.ServiceDivisions;
using Service.Setup.UnitTypes;
using Service.CustomerLocations;
using Service.Contracts;
using Service.LocationServices;

namespace Service.Base {
    class ValidationService {

        //List of Validation Services
 
        private readonly ServiceAreaValidator _serviceAreaValidator;
        private readonly ServiceDivisionValidator _serviceDivisionValidator;
        private readonly UnitTypeValidator _unitTypeValidator;
        private readonly StateValidator _stateValidator;
        private readonly GoodsValidator _goodsValidator;
        private readonly CustomerLocationValidator _customerLocationValidator;
        private readonly ContractValidator _contractValidator;
        private readonly LocationServiceValidator _locationServiceValidator;

        private readonly ContactValidator _contactvalidator;
        private readonly CustomerValidator _customervalidator;
        private readonly CustomerSourceValidator _customerSourceValidator;
        private readonly UserValidator _userValidator;
        protected IPrimaryContext Context;



        public ValidationService(IPrimaryContext context) {
            Context = context;
            _contactvalidator = new ContactValidator();
            _customervalidator = new CustomerValidator();
            _userValidator = new UserValidator(context);
            _customerSourceValidator = new CustomerSourceValidator(context);           

            _serviceAreaValidator = new ServiceAreaValidator(context);
            _serviceDivisionValidator = new ServiceDivisionValidator(context);
            _unitTypeValidator = new UnitTypeValidator(context);
            _stateValidator = new StateValidator(context);
            _goodsValidator = new GoodsValidator(context);
            _customerLocationValidator = new CustomerLocationValidator(context);
            _contractValidator = new ContractValidator(context);
            _locationServiceValidator = new LocationServiceValidator(context);

        }



        internal IValidator<T> GetValidator<T>(T obj) {

            switch (typeof(T)) {
                case Type ty when ty == typeof(Contact): {
                        return (IValidator<T>)_contactvalidator;
                    }
                case Type ty when ty == typeof(Customer): {
                        return (IValidator<T>)_customervalidator;
                    }
                case Type ty when ty == typeof(User): {
                        return (IValidator<T>)_userValidator;
                    }
                case Type ty when ty == typeof(CustomerSource): {
                        return (IValidator<T>)_customerSourceValidator;
                    }
                case Type ty when ty == typeof(ServiceDivision):
                    {
                        return (IValidator<T>)_serviceDivisionValidator;
                    }
                case Type ty when ty == typeof(UnitType):
                    {
                        return (IValidator<T>)_unitTypeValidator;
                    }
                case Type ty when ty == typeof(ServiceArea):
                    {
                        return (IValidator<T>)_serviceAreaValidator;
                    }
                case Type ty when ty == typeof(State):
                    {
                        return (IValidator<T>)_stateValidator;
                    }
                case Type ty when ty == typeof(Good):
                    {
                        return (IValidator<T>)_goodsValidator;
                    }
                case Type ty when ty == typeof(CustomerLocation):
                    {
                        return (IValidator<T>)_customerLocationValidator;
                    }
                case Type ty when ty == typeof(Contract):
                    {
                        return (IValidator<T>)_contractValidator;
                    }
                case Type ty when ty == typeof(Model.LocationService):
                    {
                        return (IValidator<T>)_locationServiceValidator;
                    }

            }

            throw new NotImplementedException();
        }

    }
}
