using System.Linq;

namespace API.Common
{
    /// <summary>
    ///      Generic interface for search results
    /// </summary>
    public interface ISearchResults<out T> where T : class
    {
        /// <summary>
        ///      Gets or sets the total hits for the query results
        /// </summary>
        long TotalHits { get; set; }
        /// <summary>
        ///      Gets results set. This will be limited based on paging.
        /// </summary>
        IQueryable<T> Results { get; }
    }
}