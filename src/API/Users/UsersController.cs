using System;
using API.ControllerBase;
using Model;
using Service.Users;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using API.Base.Claims;
using API.Claims;
using API.Common;
using ClaimTypes = API.Claims.ClaimTypes;
using User = Model.User;
using Service.Base;
using API.CRUD;
using API.Users.Models;
using Service.Auth.Models;
using Service.Common.Address;
using Service.Common.Phone;
using Service.Users.Models;
using Service;

namespace API.Users
{
    [RoutePrefix("api/v1/users")]
    [Restrict(ClaimTypes.Users, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class UsersController : CrudVersionController<User>
    {
        private readonly IRequestDocReader _docReader;
        private readonly IUserService _userService;

        public UsersController(IUserService userService, IRequestDocReader docReader, ICRUDService crudservice)
            : base(crudservice)
        {
            _userService = userService;
            _docReader = docReader;
            Searchfields = new[] { new CrudSearchFieldType("FirstName", CrudSearchFieldType.Method.Contains),
            new CrudSearchFieldType("LastName", CrudSearchFieldType.Method.Contains),
            new CrudSearchFieldType("Email", CrudSearchFieldType.Method.Contains)};
            Searchchildincludes = new[] { "Address" };
            Getbyincludes = new[] { "UserPhones", "Address", "Image", "AuthUser" };
            Orderby = "LastName";
        }
        [HttpGet]
        [Route("simple")]
        public IEnumerable<Simplified<User>> GetSimpleUsers()
        {
            return _userService.GetSimplifiedUsers()
                .OrderBy(sc => sc.Name);
        }
        [HttpPost]
        [Route("create")]
        [ResponseType(typeof(int))]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        public IHttpActionResult PostUser(UserCreateParams ucp) {
            return ExecuteValidatedAction(() => {
                if (ucp == null) return BadRequest();
                _userService.Create(ucp.User, ucp.Username, ucp.Password, ucp.UserRoleId, ucp.SendEmail);
                return Ok(ucp.User.Id);
            });
        }

        [AllowSelfEdit]
        public override User GetById(int id) {
            return Getbyincludes.Length > 0 ? Crudservice.GetById<User>(id, Getbyincludes) : Crudservice.GetById<User>(id);
        }

        [HttpDelete]
        [Route("{userId:int}/address")]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        public IHttpActionResult DeleteAddress(int userId)
        {
            return ExecuteConcurrentValidatedAction(userId, () =>
            {
                _userService.DeleteAddress(userId);
                return Ok();
            }, _userService.Reload);
        }

        [HttpDelete]
        [Route("{userId:int}/documents/{docId:int}")]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        public IHttpActionResult DeleteDoc(int userId, int docId)
        {
            return ExecuteValidatedAction(() =>
            {
                _userService.DeleteDocument(userId, docId);
                return Ok();
            });
        }

        [HttpDelete]
        [Route("{userId:int}/pic")]
        [ResponseType(typeof(byte[]))]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        public IHttpActionResult DeletePic(int userId)
        {
            return ExecuteValidatedAction(() => Ok(_userService.DeleteImage(userId)));
        }

        [HttpPost]
        [Route("forgot")]
        [AllowAnonymous]
        public IHttpActionResult ForgotPassword(EmailParam emailParam)
        {
            try
            {
                if (emailParam == null) return BadRequest();
                _userService.ForgotPassword(emailParam.Email);
                return Ok();
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }

        }

        [HttpPost]
        [Route("{userId:int}/address")]
        [ResponseType(typeof(CreateAddressResult))]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        public IHttpActionResult PostUserAddress(int userId, Address address)
        {
            return ExecuteConcurrentValidatedAction(userId,
                () => Ok(_userService.CreateAddress(userId, address)),
                _userService.Reload);
        }

        [HttpPut]
        [Route("{userId:int}/phones")]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public IHttpActionResult PutPhones(int userId, [FromBody] PhoneCollection<UserPhone> phones)
        {
            return ExecuteValidatedAction(() =>
            {
                _userService.MergePhones(userId, phones);
                return Ok();
            });
        }


        [HttpPut]
        [Route("{userId:int}")] // this is needed to allow self editing...
        [ResponseType(typeof(byte[]))]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public IHttpActionResult PutUser(int userId, User user)
        {
            return ExecuteConcurrentValidatedAction(user, _userService.UpdateUser, _userService.Reload);
        }

        [HttpGet]
        [Route("{userId:int}/documents/_search")]
        public IEnumerable<Document> SearchUserDocuments(int userId, string q, int skip = 0, int take = 12)
        {
            var query = _userService.GetUserDocuments(userId);
            if (!IsBlankQuery(q))
            {
                string[] terms = SplitSearchTerms(q);
                query = query.Where(d => terms.All(t => d.Name.Contains(t)));
            }
            var ct = query.Count();
            return query
                .OrderByDescending(d => d.DateUpload)
                .ThenBy(d => d.Name)
                .Skip(skip)
                .Take(take)
                .ToSearchResults(ct)
                .Respond(this);
        }

        [HttpPut]
        [Route("{userId:int}/address")]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public IHttpActionResult UpdateAddress(int userId, Address address)
        {
            return ExecuteValidatedAction(() =>
            {
                _userService.UpdateAddress(address);
                return Ok();
            });
        }

        [HttpPost]
        [Route("{userId:int}/documents")]
        [ResponseType(typeof(Document))]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        public async Task<IHttpActionResult> UploadDoc(int userId)
        {
            return await ExecuteValidatedActionAsync(async () =>
            {
                var doc = await _docReader.GetDocBytesFromRequest(this);
                var uploadedBy = this.GetUserId();
                var docRec = _userService.CreateDocument(userId, doc.FileName, doc.DocBytes, uploadedBy);
                return Ok(docRec);
            });
        }


        [HttpPost]
        [Route("{userId:int}/pic")]
        [ResponseType(typeof(UpdateUserPicResult))]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public async Task<IHttpActionResult> UploadPic(int userId)
        {
            return await ExecuteValidatedActionAsync(async () =>
            {
                var pic = await _docReader.GetDocBytesFromRequest(this);
                var result = _userService.UpdatePic(userId, pic.DocBytes, pic.FileName);
                return Ok(result);
            });
        }
    }
}
