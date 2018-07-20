using API.Auth.Models;

namespace API.Users.Models
{
    public class UserLoginResult : ILoginResultDto
    {
        public LoginResult LoginResult { get; set; }
        public Model.User User { get; set; }
    }
}
