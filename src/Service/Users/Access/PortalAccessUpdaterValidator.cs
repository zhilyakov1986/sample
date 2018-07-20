using FluentValidation;
using Service.Utilities;

namespace Service.Users.Access
{
    public class PortalAccessUpdaterValidator : AbstractValidator<PortalAccessUpdater>
    {
        public PortalAccessUpdaterValidator()
        {
            RuleFor(ac => ac.Username)
                .NotEmpty()
                .Length(0, 50)
                .Matches(RegexPatterns.UsernamePattern)
                .WithMessage(RegexPatterns.UsernameErrorMsg);
            RuleFor(ac => ac.UserRoleId).NotEmpty();
        }
    }
}