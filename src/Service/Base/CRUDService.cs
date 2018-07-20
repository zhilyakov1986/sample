using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Script.Serialization;
using FluentValidation;
using Model;
using Service.Utilities;
using System.Linq.Expressions;
using System.Reflection;
using AutoMapper.Internal;
using FluentValidation.Results;

namespace Service.Base
{
    public class CRUDService : BaseService, ICRUDService {

        private static ValidationService _validationService;
        public CRUDService(IPrimaryContext context)
            : base(context) {
            _validationService = new ValidationService(context);
        }

        /// <summary>
        /// Creates a row in the database for the entity T
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data">The entity to attach</param>
        public int Create<T>(T data) where T : class, IEntity {
            var parameter = Expression.Parameter(typeof(T));
            var props = typeof(T).GetProperties();
            foreach (System.Reflection.PropertyInfo prop in props
                .Where(x => x.CustomAttributes
                .Any(z => z.AttributeType.Name
                .Equals("ForeignKeyAttribute"))))
            {
                prop.SetValue(data, null);
            }

            ThrowIfNull(data);
            ValidateAndThrow(data, _validationService.GetValidator<T>(data));
            Context.Set<T>().Add(data);
            // ReSharper disable once PossibleNullReferenceException
            Context.SaveChanges();
            return data.Id;
        }

        /// <summary>
        ///     Gets all of an entity.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns>Returns an IEnumerable of the entity.</returns>
        public IQueryable<T> Get<T>() where T : class, IEntity {
            return Context.Set<T>().AsQueryable();
        }

        /// <summary>
        ///     Gets all of an entity.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="includes">The entities to attach</param>
        /// <returns>Returns an IEnumerable of the entity.</returns>
        public IQueryable<T> Get<T>(string[] includes) where T : class, IEntity
        {
            var query = Context.Set<T>().AsQueryable();
            if (includes.Length > 0) {
                query = includes.Aggregate(query, (current, t) => current.Include(t));
            }
            return query;
        }


        /// <summary>
        ///     Gets an entity by Id.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="id"></param>
        /// <returns>Returns the entity, or null if not found.</returns>
        public new T GetById<T>(int id) where T : class, IEntity {
            return Context.Set<T>().SingleOrDefault(c => c.Id == id);
        }

        public T GetById<T>(int id, string[] includes) where T : class, IEntity {
            var query = Context.Set<T>().AsQueryable();

            if (includes.Length > 0) {
                for (int i = 0; i < includes.Length; i++) {
                    query = query.Include(includes[i]);
                }
            }

            return query.SingleOrDefault(c => c.Id == id);
        }

        /// <summary>
        /// Updates a generic model T with the generic Class given.
        /// Maps the field names of the JSON object to the field names on
        /// the model T.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data">The entity to attach</param>
        public void Update<T>(T data) where T : class, IEntity, new() {
            ThrowIfNull(data);
            ValidateAndThrow(data, _validationService.GetValidator<T>(data));
            Context.Set<T>().Attach(data);
            Context.SetEntityState(data, EntityState.Modified);
            Context.SaveChanges();
        }

        /// <summary>
        /// Updates a generic model T with the generic JSON data given.
        /// Maps the field names of the JSON object to the field names on
        /// the model T.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data">The generic JSON object</param>
        public void Update<T>(string data) where T : class, IEntity, new() {
            ThrowIfNull(data);

            var dict = (IDictionary<string, object>)new JavaScriptSerializer().DeserializeObject(data.ToString());

            var obj = new T() {
                Id = Convert.ToInt32(dict["Id"])
            };
            Context.Set<T>().Attach(obj);
            ContextHelper.Map(dict, obj, Context);
            Context.SaveChanges();
        }

        /// <summary>
        /// Updates a generic list T.
        /// This overwrites the Lists, if you only want to update specific fields add a mapping action as a second parameter.
        /// ONLY USE FOR SMALL LISTS, Bigger Lists should use a BulkExtension Package.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="itemList">List of the Generic Object</param>
        /// <param name="mapping">This contains the mapping of the object for example: (e,u) => e.name = u.name</param>
        public void Update<T>(IEnumerable<T> itemList) where T : class, IEntity {
            ThrowIfNull(itemList);
            var existing = Context.Set<T>();
            Context.Set<T>().AddRange(itemList);
            Context.SaveChanges();
        }

        /// <summary>
        /// Updates a generic list T.
        /// Maps the properties to update using the mapping function.
        /// ONLY USE FOR SMALL LISTS, Bigger Lists should use a BulkExtension Package.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="itemList">List of the Generic Object</param>
        /// <param name="mapping">This contains the mapping of the object for example: (e,u) => e.name = u.name</param>
        public void Update<T>(IEnumerable<T> itemList, Action<T, T> mapping) where T : class, IEntity {
            var enumerable = itemList as T[] ?? itemList.ToArray();
            ThrowIfNull(enumerable);
            foreach (var item in itemList) {
                ValidateAndThrow(item, _validationService.GetValidator<T>(item));
            }
                ;
            var existing = Context.Set<T>();
            Context.Merge<T>()
                .SetExisting(existing)
                .SetUpdates(enumerable)
                .MergeBy((e, u) => e.Id == u.Id)
                .MapUpdatesBy(mapping)
                .Merge();
            Context.SaveChanges();
        }

        /// <summary>
        /// Updates a generic model T with the generic JSON data given.
        /// Maps the field names of the JSON object to the field names on
        /// the model T.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data">The generic JSON object</param>
        /// <returns>The rowversion of the updated object</returns>
        public byte[] UpdateVersionable<T>(string data) where T : class, IEntity, IVersionable, new() {
            ThrowIfNull(data);

            var dict = (IDictionary<string, object>)new JavaScriptSerializer().DeserializeObject(data.ToString());
            var obj = new T() {
                Id = Convert.ToInt32(dict["Id"]),
                Version = Convert.FromBase64String(dict["Version"].ToString())
            };
            Context.Set<T>().Attach(obj);
            ContextHelper.Map(dict, obj, Context);
            Context.SaveChanges();

            return obj.Version;
        }

        /// <summary>
        /// Updates a generic model T with the generic JSON data given.
        /// Maps the field names of the JSON object to the field names on
        /// the model T.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data">The generic JSON object</param>
        /// <returns>The rowversion of the updated object</returns>
        public byte[] UpdateVersionable<T>(T data) where T : class, IEntity, IVersionable, new() {
            ThrowIfNull(data);

            ValidateAndThrow(data, _validationService.GetValidator<T>(data));
            Context.Set<T>().Attach(data);
            Context.SetEntityState(data, EntityState.Modified);
            Context.SaveChanges();

            return data.Version;
        }

        public T Reload<T>(int id) where T : class, IEntity, new() {
            return Context.Set<T>().AsNoTracking().SingleOrDefault(c => c.Id == id);
        }

        /// <summary>
        /// Needs to know what the parent Entity is as well as the FK Entity.
        /// Then it determines if it should throw a validation exception that the item is in use.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TS"></typeparam>
        /// <param name="itemList"></param>
        /// <param name="foreignKeyColumnName"></param>
        /// <param name="entityErrorMsg"></param>
        /// <returns></returns>
        public bool CheckEntityInUse<T, TS>(IEnumerable<T> itemList, string foreignKeyColumnName, string entityErrorMsg) where T : class, IEntity where TS : class, IEntity {

            var existing = Context.Set<T>().ToArray();
            var toRemove = existing.Where(e => itemList.All(u => e.Id != u.Id)).ToArray();

            if (toRemove.Length == 0) return false;

            var ids = toRemove.Select(tr => tr.Id).ToList();
            var filterField = foreignKeyColumnName;

            var eParam = Expression.Parameter(typeof(TS), "e");
            CheckNullable(ids, filterField, eParam, out List<int?> nullableList);
            var method = nullableList != null ? nullableList.GetType().GetMethod("Contains") : ids.GetType().GetMethod("Contains");

            if (method != null)
            {
                var call = nullableList != null
                    ? Expression.Call(Expression.Constant(nullableList), method, Expression.Property(eParam, filterField))
                    : Expression.Call(Expression.Constant(ids), method, Expression.Property(eParam, filterField));

                var predicate = Expression.Lambda<Func<TS, bool>>(call, eParam);

                if (Context.Set<TS>().Where(predicate).ToList().Count <= 0) return false;
            } else {
                throw new NullReferenceException("method is null");
            }

            var error = new ValidationFailure("Id", entityErrorMsg);
            throw new ValidationException(new[] { error });
        }

        private static void CheckNullable(IEnumerable<int> ids, string filterField, Expression eParam, out List<int?> nullableList)
        {
            var member = (PropertyInfo)Expression.Property(eParam, filterField).Member;
            nullableList = member.PropertyType.IsNullableType() ? ids.Select(i => (int?)i).ToList() : null;
        }


        public void Delete<T>(int id) where T : class, IEntity, new() {
            T obj = new T { Id = id };
            Context.Set<T>().Attach(obj);
            Context.Set<T>().Remove(obj);
            Context.SaveChanges();
        }

        public void Delete<T>(T data) where T : class, IEntity, new() {
            Context.Set<T>().Attach(data);
            Context.Set<T>().Remove(data);
            Context.SaveChanges();
        }

    }

}
