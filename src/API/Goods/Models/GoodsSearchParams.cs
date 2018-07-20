namespace API.Goods.Models
{
    public class GoodsSearchParams
    {
        public string Query { get; set; }
        public int[] ServiceTypeIds { get; set; }
        public int[] ServiceDivisionIds { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }
}
