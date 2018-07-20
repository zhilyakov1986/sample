using System.Linq;
using FluentValidation;
using Model;

namespace Service.Users
{
    internal class UserValidator : AbstractValidator<User>
    {
        protected IPrimaryContext Context;
        public UserValidator(IPrimaryContext context) {
            Context = context;
            RuleFor(u => u.FirstName).NotEmpty().Length(0, 50);
            RuleFor(u => u.LastName).NotEmpty().Length(0, 50);
            RuleFor(u => u.Email).NotEmpty().Length(0, 50)
                .Matches(Utilities.RegexPatterns.EmailPattern)
                .WithMessage(Utilities.RegexPatterns.EmailErrorMsg)
                .Must(IsUniqueEmail)
                .WithMessage("This email address is already associated with an account.");
        }

        private bool IsUniqueEmail(User user, string email) {
            return !Context.Users.Any(u => u.Email == email && u.Id != user.Id);
        }
    }
}
