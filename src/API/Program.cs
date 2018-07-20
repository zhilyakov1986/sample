using Service.Utilities;
using Topshelf;

namespace API
{
    public class Program
    {
        public static int Main(string[] args)
        {
            HostFactory.Run(c =>
            {
                c.Service<ApiService>();
                c.SetServiceName(AppSettings.GetServiceName());
                c.SetDisplayName(AppSettings.GetServiceDisplayName());
                c.SetDescription(AppSettings.GetServiceDescription());
                c.RunAsNetworkService();
                c.EnableShutdown();
            });

            return 0;
        }
    }
}