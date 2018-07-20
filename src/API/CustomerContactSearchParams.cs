namespace API.Customers
{
    public class CustomerContactSearchParams
    {
        public int CustomerId { get; set; }
        public string Query { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
        public int[] StatusIds { get; set; }
    }
}