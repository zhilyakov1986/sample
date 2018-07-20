using System.Collections.Generic;
using System.Linq;
using API.ControllerBase;

namespace API.Common
{
    /// <summary>
    ///      Generic search results which exposes the results and the total hits
    /// </summary>
    public class SearchResults<T> : ISearchResults<T> where T : class
    {
        public SearchResults(long totalHits, IQueryable<T> results)
        {
            TotalHits = totalHits;
            Results = results;
        }
        /// <summary>
        ///      Gets or sets the results of the query including any paging, etc.
        /// </summary>
        public IQueryable<T> Results { get; set; }
        /// <summary>
        ///      Gets or sets the total number of hits for the query
        /// </summary>
        public long TotalHits { get; set; }
    }


    public static class SearchExtensions
    {
        public static SearchResults<T> ToSearchResults<T>(this IQueryable<T> query, int totalCount) where T : class
        {
            return new SearchResults<T>(totalCount, query);
        }

        public static IEnumerable<T> Respond<T>(this SearchResults<T> searchResults, ApiControllerBase controller) where T: class
        {
            return controller.HandleSearchResults(searchResults);
        }
    }

}
