using FluentValidation;
using Model;
using System.Linq;

namespace Service.Contracts
{
    internal class ContractValidator : AbstractValidator<Contract>
    {
        protected IPrimaryContext Context;
        public ContractValidator(IPrimaryContext context)
        {

            RuleFor(s => s.StartDate)
                .Must(BeBeforeEndDate)
                .WithMessage("Start Date Must be before the End Date");
            RuleFor(s => s.EndDate)
                .Must(BeNotInThePast)
                .WithMessage("End Date Can't be in the past.");

        }
        private bool BeBeforeEndDate(Contract contract, System.DateTime startDate)
        {
            return contract.EndDate > startDate ? true : false;
        }
        private bool BeNotInThePast(Contract contract, System.DateTime endDate)
        {
            var thisDay = System.DateTime.Today;
            return endDate >= thisDay ? true : false;
        }
    }
}
