namespace API.Claims
{
    public static class ClaimsHelper
    {
        public static string SetTypePrefix(int t)
        {
            return "claimstype_" + t;
        }

        public static string SetValuePrefix(int v)
        {
            return "claimsval_" + v;
        }
    }
}