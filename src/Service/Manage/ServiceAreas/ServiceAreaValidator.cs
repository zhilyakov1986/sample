using Model;
using System.Linq;
using FluentValidation;

namespace Service.Setup.ServiceAreas
{
    internal class ServiceAreaValidator : AbstractValidator<ServiceArea>
    {
        protected IPrimaryContext Context;
        public ServiceAreaValidator(IPrimaryContext context)
        {
            Context = context;
            RuleFor(s => s.Name)
                .NotEmpty()
                .Length(0, 50)
                .Must(BeAUniqueServiceArea)
                .WithMessage("There are duplicate Service Areas.");
        }
        private bool BeAUniqueServiceArea(ServiceArea ServiceArea, string name)
        {
            return !Context.ServiceAreas.Any(bg => bg.Name == name && bg.Id != ServiceArea.Id);
        }
    }
}
