using System;
using Autofac;
using FluentValidation;

namespace Service
{

    public class AutofacValidatorFactory : ValidatorFactoryBase
    {
        private readonly IComponentContext _componentContext;

        public AutofacValidatorFactory(IComponentContext container)
        {
            _componentContext = container;
        }

        public override IValidator CreateInstance(Type validatorType)
        {
            // NOTE: componentContext.Resolve would error if the type wasn't registered (e.g. a dto)
            return _componentContext.ResolveOptional(validatorType) as IValidator;
        }
    }
}