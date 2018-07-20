using System;
using System.Linq;

namespace Service.Utilities
{
    public static class QueryableExtensions
    {
        public static IOrderedEnumerable<TK> OrderByDir<TK>(this IQueryable<TK> query, Func<TK, object> orderBy, string orderDir)
        {
            var dir = orderDir.ToLower();
            if (dir == "asc" || dir == "ascending")
                return query.OrderBy(orderBy);

            return query.OrderByDescending(orderBy);
        }
    }
}