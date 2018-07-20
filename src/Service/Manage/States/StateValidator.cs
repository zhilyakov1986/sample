using Model;
using System.Linq;
using FluentValidation;
using System;

namespace Service.Manage.States
{
    internal class StateValidator : AbstractValidator<State>
    {
        protected IPrimaryContext Context;
        public StateValidator(IPrimaryContext context)
        {
            Context = context;
            RuleFor(s => s.Name)
                .NotEmpty()
                .Length(0, 50)
                .Must(BeAUniqueState)
                .WithMessage("There are duplicate States.");
            RuleFor(t => t.TaxRate)
                .Must(BeInARange)
                .WithMessage("Please Enter Value Between 0 and 100");
        }

        private bool BeInARange(decimal? decTax)
        {
            if (decTax < 0 || decTax > 1)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        
        private bool BeAUniqueState(State state, string name)
        {
            return !Context.States.Any(bg => bg.Name == name && bg.Id != state.Id);
        }
    }
}
