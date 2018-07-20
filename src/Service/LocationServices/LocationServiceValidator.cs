using FluentValidation;
using Model;
using System.Linq;


namespace Service.LocationServices
{
    class LocationServiceValidator: AbstractValidator<Model.LocationService>
    {
        protected IPrimaryContext Context;
        public LocationServiceValidator( IPrimaryContext context)
        {
            RuleFor(ls => ls.Price)
                .NotEmpty()
                .WithMessage("Price is required");
                
        }
    }
}
