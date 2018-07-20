using Model;
using System.Linq;
using FluentValidation;

namespace Service.Setup.ServiceDivisions
{
    internal class ServiceDivisionValidator : AbstractValidator<ServiceDivision>
    {
        protected IPrimaryContext Context;
        public ServiceDivisionValidator(IPrimaryContext context)
        {
            Context = context;
            RuleFor(s => s.Name)
                .NotEmpty()
                .Length(0, 50)
                .Must(BeAUniqueServiceDivision)
                .WithMessage("There are duplicate Service Divisions.");
        }
        private bool BeAUniqueServiceDivision(ServiceDivision ServiceDivision, string name)
        {
            return !Context.ServiceDivisions.Any(bg => bg.Name == name && bg.Id != ServiceDivision.Id);
        }
    }
}
