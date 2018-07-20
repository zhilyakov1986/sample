using Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;

namespace API.Users
{
    public class UserCsvFormatter : BufferedMediaTypeFormatter
    {
        public UserCsvFormatter()
        {
            SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/csv"));
        }

        public override bool CanWriteType(Type type)
        {
            if (type == typeof(User))
                return true;
            Type enumerableType = typeof(IEnumerable<User>);
            return enumerableType.IsAssignableFrom(type);
        }

        public override bool CanReadType(Type type)
        {
            return false;
        }

        public override void WriteToStream(Type type, object value, Stream writeStream, HttpContent content)
        {
            using (var writer = new StreamWriter(writeStream))
            {
                WriteHeader(writer);
                var users = value as IEnumerable<User>;
                if (users != null)
                {
                    foreach (var user in users)
                        WriteItem(user, writer);
                }
                else
                {
                    var user = value as User;
                    if (user == null)
                        throw new InvalidOperationException("Cannot serialize type");
                    WriteItem(user, writer);
                }
            }
        }

        public override void SetDefaultContentHeaders(Type type, HttpContentHeaders headers, MediaTypeHeaderValue mediaType)
        {
            base.SetDefaultContentHeaders(type, headers, mediaType);
            headers.ContentType = new MediaTypeHeaderValue("text/csv");
            headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = "employee.csv" };
        }

        private void WriteHeader(StreamWriter writer)
        {
            writer.WriteLine("{0},{1},{2},{3}",
                "LastName",
                "FirstName",
                "Email",
                "User Role");
            //"Status");
        }

        private void WriteItem(User user, StreamWriter writer)
        {
            writer.WriteLine("{0},{1},{2},{3}", Escape(user.LastName),
                Escape(user.FirstName),
                Escape(user.Email),
                Escape(GetUserRole(user)));
            //Escape(user.UserStatus.Name));
        }

        private string GetUserRole(User user)
        {
            if (user.AuthUser == null)
                return "";

            return user.AuthUser.UserRole == null ? "" : user.AuthUser.UserRole.Name;
        }

        private static readonly char[] SpecialChars = { ',', '\n', '\r', '"' };

        private string Escape(string o)
        {
            if (o == null)
                return "";

            return o.IndexOfAny(SpecialChars) != -1 ? $"\"{o.Replace("\"", "\"\"")}\"" : o;
        }
    }
}