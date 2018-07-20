using System.Net.Mail;

namespace Service.Utilities
{
    public static class Email
    {
        /// <summary>
        ///     Sends an email.
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <param name="isHtml"></param>
        public static void SendEmail(string from, string to, string subject, string body, bool isHtml = true)
        {
            to = IsTestMode() ? GetTestEmail() : to;
            using (var client = new SmtpClient())
            {
                var msg = new MailMessage(from, to, subject, body) { IsBodyHtml = isHtml };
                client.Send(msg);
            }
        }

        /// <summary>
        ///     Checks config settings to see if a test email should be used.
        /// </summary>
        /// <returns></returns>
        public static bool IsTestMode()
        {
            return Utilities.AppSettings.IsEmailTestMode();
        }

        /// <summary>
        ///     Gets a test email address for the recipient, from config settings.
        /// </summary>
        /// <returns></returns>
        public static string GetTestEmail()
        {
            return Utilities.AppSettings.GetTestEmail();
        }
    }
}