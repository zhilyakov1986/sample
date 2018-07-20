using FluentValidation;
using FluentValidation.Results;
using Model;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using ClaimType = Model.ClaimType;
using ClaimValue = Model.ClaimValue;
using UserRole = Model.UserRole;

namespace Service.UserRoles
{
    public class UserRoleService : BaseService, IUserRoleService
    {
        private readonly IValidator<UserRole> _userRoleValidator;

        public UserRoleService(IPrimaryContext ctx)
            : base(ctx)
        {
            _userRoleValidator = new UserRoleValidator(this);
        }

        /// <summary>
        ///     Checks that a UserRole name is unique before saving.
        /// </summary>
        /// <param name="role"></param>
        /// <param name="name"></param>
        /// <returns>Returns a bool indicating uniqueness.</returns>
        public bool BeAUniqueUserRoleName(UserRole role, string name)
        {
            return !Context.UserRoles.Any(r => r.Name == name && r.Id != role.Id);
        }

        /// <summary>
        ///     Creates a new UserRole.
        /// </summary>
        /// <param name="role"></param>
        public void Create(UserRole role)
        {
            ThrowIfNull(role);
            role.IsEditable = true;
            ValidateAndThrow(role, _userRoleValidator);
            Context.UserRoles.Add(role);
            Context.SaveChanges();
        }

        /// <summary>
        ///     Deletes a UserRole, if not in use.
        /// </summary>
        /// <param name="roleId"></param>
        public void Delete(int roleId)
        {
            ThrowIfRoleInUse(roleId);
            var role = Context.UserRoles.Include(r => r.UserRoleClaims).Single(r => r.Id == roleId);
            ThrowIfNull(role);
            ThrowIfRoleNotEditable(role.IsEditable);

            // remove all claim values
            Context.UserRoleClaims.RemoveRange(role.UserRoleClaims);
            Context.UserRoles.Remove(role);
            Context.SaveChanges();
        }

        /// <summary>
        ///     Gets a UserRole by Id, with Claims.
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns>Returns a UserRole, or null if not found.</returns>
        public UserRole GetById(int roleId)
        {
            return Context.UserRoles
                .Include(ur => ur.UserRoleClaims)
                .Include(ur => ur.UserRoleClaims.Select(urc => urc.ClaimType))
                .Include(ur => ur.UserRoleClaims.Select(urc => urc.ClaimValue))
                .SingleOrDefault(ur => ur.Id == roleId);
        }

        /// <summary>
        ///     Gets ClaimTypes
        /// </summary>
        /// <returns>Returns an IEnumerable of ClaimTypes.</returns>
        public IEnumerable<ClaimType> GetClaimTypes()
        {
            return Context.ClaimTypes.AsEnumerable();
        }

        /// <summary>
        ///     Gets ClaimValues
        /// </summary>
        /// <returns>Returns an IEnumerable of ClaimValues.</returns>
        public IEnumerable<ClaimValue> GetClaimValues()
        {
            return Context.ClaimValues.AsEnumerable();
        }

        /// <summary>
        ///     Gets UserRoles with associated Claims.
        /// </summary>
        /// <returns>Returns an IEnumerable of UserRoles.</returns>
        public IQueryable<UserRole> GetRolesWithClaims()
        {
            return Context.UserRoles
                .Include(ur => ur.UserRoleClaims)
                .Include(ur => ur.UserRoleClaims.Select(urc => urc.ClaimType))
                .Include(ur => ur.UserRoleClaims.Select(urc => urc.ClaimValue))
                .AsNoTracking();
        }

        /// <summary>
        ///     Updates a UserRole.
        ///     Makes sure the db version is editable.
        /// </summary>
        /// <param name="role"></param>
        public void Update(UserRole role)
        {
            ThrowIfNull(role);
            // only pulling dbRole to make sure it is editable, otherwise could just attach...
            var dbRole = Context.UserRoles.Single(ur => ur.Id == role.Id);
            dbRole.Name = role.Name;
            dbRole.Description = role.Description;
            ValidateAndThrow(dbRole, _userRoleValidator); // ensures editable
            Context.SetEntityState(dbRole, EntityState.Modified);
            Context.SaveChanges();
        }

        /// <summary>
        ///     Updates the claims associated to a specific UserRole.
        /// </summary>
        /// <param name="roleId"></param>
        /// <param name="urClaims"></param>
        public void UpdateClaims(int roleId, IEnumerable<UserRoleClaim> urClaims)
        {
            urClaims.Select(c => { c.ClaimValue = null; return c; }).ToList();
            urClaims.Select(c => { c.ClaimType = null; return c; }).ToList();
            urClaims.Select(c => { c.UserRole = null; return c; }).ToList();
            var existing = Context.UserRoleClaims.Where(urc => urc.RoleId == roleId);
            Context.Merge<UserRoleClaim>()
                .SetExisting(existing)
                .SetUpdates(urClaims)
                .MergeBy((e, u) => e.RoleId == u.RoleId 
                    && e.ClaimTypeId == u.ClaimTypeId
                    && e.ClaimValueId == u.ClaimValueId
                )
                .Merge();
            Context.SaveChanges();
        }

        private static void ThrowIfRoleNotEditable(bool isEditable)
        {
            if (isEditable) return;
            var error = new ValidationFailure("User Role", "This role is a system default and cannot be deleted.");
            throw new ValidationException(new[] { error });
        }

        private void ThrowIfRoleInUse(int roleId)
        {
            if (!Context.AuthUsers.Any(au => au.RoleId == roleId)) return;
            var error = new ValidationFailure("User Role", "This role is still in use.");
            throw new ValidationException(new[] { error });
        }
    }
}
