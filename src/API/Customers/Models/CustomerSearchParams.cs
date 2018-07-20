namespace API.Customers.Models
{
    public class CustomerSearchParams
    {
        public string Query { get; set; }
        public int[] SourceIds { get; set; }
        public int[] StatusIds { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }
}
