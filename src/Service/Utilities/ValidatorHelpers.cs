using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text.RegularExpressions;
using FluentValidation;
using Model;

namespace Service.Utilities
{
    public static class ValidatorHelpers
    {
        public static bool BeAnEmptyOrValidEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
                return true;

            var r = new Regex(RegexPatterns.EmailPattern);
            return r.IsMatch(email);
        }

        /// <summary>
        ///      Tests password strength.
        /// </summary>
        /// <param name="pword"></param>
        /// <returns>Returns a bool indicating whether password is strong enough.</returns>
        public static bool BeAStrongPassword(string pword)
        {
            if (string.IsNullOrEmpty(pword)) return false;
            Regex rgx = new Regex(RegexPatterns.PasswordPattern);
            return rgx.IsMatch(pword);
        }

        /// <summary>
        ///     Checks for more than one preferred phone number.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="nums"></param>
        /// <returns>Returns a bool indicating whether there's more than one preferred phone number.</returns>
        public static bool HaveAtMostOnePrimaryPhoneNumber<T>(ICollection<T> nums) where T: IHasPhoneNumber
        {
            return nums == null || nums.Count(n => n.IsPrimary) <= 1;
        }

        public static bool HaveAtMostOnePrimaryPhoneNumber<T>(IEnumerable<T> nums) where T : IHasPhoneNumber
        {
            return nums == null || nums.Count(n => n.IsPrimary) <= 1;
        }

        /// <summary>
        ///     Ensures there are no duplicate phone numbers.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="nums"></param>
        /// <returns>Returns a bool indicating whether there are duplicates.</returns>
        public static bool NotHaveDuplicatePhoneNumbers<T>(ICollection<T> nums) where T: IHasPhoneNumber
        {
            return nums.Select(n => n.Phone + n.Extension).Distinct().Count() == nums.Count;
        }

        /// <summary>
        ///     Wrapper to validate and throw for testing.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entity"></param>
        /// <param name="validator"></param>
        public static void ValidateAndThrow<T>(T entity, IValidator<T> validator)
        {
            var res = validator.Validate(entity);
            if (!res.IsValid)
                throw new ValidationException(res.Errors);
        }

        /// <summary>
        ///     Validates properties during a partial update.
        ///     Non-modified properties will be ignored.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="validator"></param>
        /// <param name="entity"></param>
        /// <param name="entityEntry"></param>
        public static void PartialValidateAndThrow<T>(this IValidator<T> validator, T entity, DbEntityEntry entityEntry)
        {
            var result = validator.Validate(entity);
            var falseErrors = result.Errors.Where(error =>
            {
                if (entityEntry.State != EntityState.Modified) return false;
                var member = entityEntry.Member(error.PropertyName);
                var property = member as DbPropertyEntry;
                if (property != null) return !property.IsModified;
                return false;
            });

            foreach (var error in falseErrors.ToArray())
                result.Errors.Remove(error);

            if (!result.IsValid)
                throw new ValidationException(result.Errors);
        }
    }

    internal abstract class BasicNameValidator<T> : AbstractValidator<T> where T: IBasicNameEntity
    {
        protected BasicNameValidator()
        {
            RuleFor(b => b.Name).NotEmpty().Length(0, 50);
        }
    }

    internal abstract class PhoneValidator<T> : AbstractValidator<T> where T : IHasPhoneNumber
    {
        protected PhoneValidator()
        {
            RuleFor(pn => pn.Phone).NotEmpty().Length(0, 20);
            RuleFor(pn => pn.Extension).Length(0, 5);
            RuleFor(pn => pn.PhoneTypeId).NotEmpty();
        }
    }
}
