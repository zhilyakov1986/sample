using Model;
using System.Linq;
using FluentValidation;

namespace Service.Setup.UnitTypes
{
    internal class UnitTypeValidator : AbstractValidator<UnitType>
    {
        protected IPrimaryContext Context;
        public UnitTypeValidator(IPrimaryContext context)
        {
            Context = context;
            RuleFor(s => s.Name)
                .NotEmpty()
                .Length(0, 50)
                .Must(BeAUniqueUnitType)
                .WithMessage("There are duplicate Service Divisions.");
        }
        private bool BeAUniqueUnitType(UnitType setupUnitType, string name)
        {
            return !Context.UnitTypes.Any(bg => bg.Name == name && bg.Id != setupUnitType.Id);
        }
    }
}
