using System.Security.Cryptography;
using System.Text;

namespace API.Csrf
{
    public class CsrfToken
    {
        public static string Create(string jwt)
        {
            return HashString(jwt);
        }

        private static string HashString(string value)
        {
            var sb = new StringBuilder();

            using (var hash = SHA256.Create())
            {
                var enc = Encoding.UTF8;
                var result = hash.ComputeHash(enc.GetBytes(value));

                foreach (var b in result)
                    sb.Append(b.ToString("x2"));
            }

            return sb.ToString();
        }
    }
}