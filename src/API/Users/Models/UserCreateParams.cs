namespace API.Users.Models
{
    public class UserCreateParams
    {
        public Model.User User { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int UserRoleId { get; set; }
        public bool SendEmail { get; set; }
    }
}
