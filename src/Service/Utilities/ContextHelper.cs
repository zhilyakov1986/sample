using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Model;

namespace Service.Utilities
{
    public static class ContextHelper
    {
        /// <summary>
        /// Deletes / adds values to a many-to-many relationship
        /// (assumes that the many-to-many relationship collection has an "Id" field)
        /// </summary>
        /// <typeparam name="TEntity">The type of entity that is being updated</typeparam>
        /// <param name="dbCollection">The collection of values currently in the database</param>
        /// <param name="newCollection">The new collection of values that should be in the database after update</param>
        /// <param name="ctx">The database context</param>
        /// <param name="idPropName">The field/column name for the primary key on the collection of entities</param>
        public static void SetDbCollectionValues<TEntity>(ICollection<TEntity> dbCollection, ICollection<TEntity> newCollection, IPrimaryContext ctx, string idPropName = "Id") where TEntity : Entity, new()
        {
            var existingIds = new HashSet<int>(dbCollection.Select(x => (int)x.GetType().GetProperty(idPropName).GetValue(x)));
            var newIds = new HashSet<int>(newCollection.Select(x => (int)x.GetType().GetProperty(idPropName).GetValue(x)));

            //deleted ones
            foreach (int delId in existingIds.Where(exId => !newIds.Contains(exId)))
            {
                dbCollection.Remove(dbCollection.Single(x => (int)x.GetType().GetProperty(idPropName).GetValue(x) == delId));
            }

            //new ones
            foreach (int newId in newIds.Where(id => !existingIds.Contains(id)))
            {
                TEntity newObj = new TEntity();
                newObj.GetType().GetProperty(idPropName).SetValue(newObj, newId);
                ctx.Entry(newObj).State = EntityState.Unchanged;
                dbCollection.Add(newObj);
            }
        }

        /// <summary>
        /// Sets all properties from a dictionary to the corresponding property
        /// name on the update object (assumes that types are the same between objects)
        /// </summary>
        /// <param name="dict">The dictionary containing the new values</param>
        /// <param name="updateObj">The object being updated</param>
        /// <param name="ctx">The db context</param>
        public static void MapDictionary<T>(IDictionary<string, object> dict, T updateObj, IPrimaryContext ctx) where T : Entity
        {
            foreach (var propName in dict.Keys)
            {
                EntityHelper.SetPropValue(updateObj, propName, dict[propName]);
                ctx.Entry(updateObj).Property(propName).IsModified = true;
            }
        }

    /// <summary>
    /// Sets all properties from a dictionary to the corresponding property
    /// name on the update object (assumes that types are the same between objects)
    /// </summary>
    /// <param name="dict">The dictionary containing the new values</param>
    /// <param name="updateObj">The object being updated</param>
    /// <param name="ctx">The db context</param>
    public static void Map<T>(IDictionary<string, object> dict, T updateObj, IPrimaryContext ctx) where T : class, IEntity
    {
      foreach (var propName in dict.Keys)
      {
        EntityHelper.SetPropValue(updateObj, propName, dict[propName]);
        ctx.Entry(updateObj).Property(propName).IsModified = true;
      }
    }
  }
}
