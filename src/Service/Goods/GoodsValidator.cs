using FluentValidation;
using Model;
using System.Linq;

namespace Service.Goods
{
    internal class GoodsValidator : AbstractValidator<Good>
    {
        protected IPrimaryContext Context;
        public GoodsValidator(IPrimaryContext context)
        {
            RuleFor(c => c.Name)
                .NotEmpty()
                .WithName("Service Name")
                .WithMessage("Service Name is Required")
                .Length(0, 50)
                .WithMessage("Service name must be less than 50 characters");
            RuleFor(p => p.Cost)
                .Must(CostLessThenPrice)
                .WithMessage("Cost can't be higher then price");                              
        }
        private bool CostLessThenPrice(Good good, decimal cost)
        {
            return good.Price < cost ? false : true;
        }
    }
}
