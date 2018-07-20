using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
using FluentValidation;
using Model;
using Service.Common.Address;
using Service.Utilities;
using Service.Utilities.Validators;

namespace Service
{
    public abstract class BaseService
    {
        protected IPrimaryContext Context;

        protected BaseService(IPrimaryContext context)
        {
            Context = context;
        }

        /// <summary>
        ///     Gets all of an entity.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns>Returns an IEnumerable of the entity.</returns>
        protected IEnumerable<T> GetAll<T>() where T : Entity
        {
            return Context.Set<T>().AsEnumerable();
        }

        /// <summary>
        ///     Gets an entity by Id.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="id"></param>
        /// <returns>Returns the entity, or null if not found.</returns>
        protected T GetById<T>(int id) where T : Entity
        {
            return Context.Set<T>().SingleOrDefault(c => c.Id == id);
        }

        /// <summary>
        ///     Manually compares the rowversion of the dbEntity to 
        ///     the one passed in for updates.
        ///     Used for concurrency checks when records must stay detached
        ///     fromt the Context.
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="updater"></param>
        protected void CompareVersionOrThrow(IVersionable entity, IVersionable updater)
        {
            if (updater.Version == null || !entity.Version.SequenceEqual(updater.Version))
                throw new DbUpdateConcurrencyException();
        }

        /// <summary>
        ///     Creates a new Document, writes to disk, and associates to whatever type is passed in.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="id"></param>
        /// <param name="fileName"></param>
        /// <param name="docBytes"></param>
        /// <param name="uploadedBy"></param>
        /// <param name="docValidator"></param>
        /// <returns>Returns the Document record.</returns>
        protected Document CreateDocument<T>(int id, string fileName, byte[] docBytes, int uploadedBy, IValidator<Document> docValidator)
           where T : Entity, IHasDocuments<Document>
        {
            var entity = Context.Set<T>().Find(id);
            ThrowIfNull(entity);
            var document = DocHelper.GenerateDocumentRecord(fileName, uploadedBy);
            ValidateAndThrow(document, docValidator);
            Context.Documents.Add(document);
            // ReSharper disable once PossibleNullReferenceException
            entity.Documents.Add(document);
            Context.SaveChanges();
            var absolutePath = DocHelper.PrependDocsPath(document.FilePath);
            File.WriteAllBytes(absolutePath, docBytes);
            return document;
        }


        /// <summary>
        ///     Deletes Docs if relevant to type.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="id"></param>
        /// <param name="docId"></param>
        protected void DeleteDocument<T>(int id, int docId) where T : Entity, IHasDocuments<Document>
        {
            var document = Context.Documents.Find(docId);
            ThrowIfNull(document);
            // ReSharper disable once PossibleNullReferenceException
            string fp = DocHelper.PrependDocsPath(document.FilePath);
            if (Context.GetEntityState(document) == EntityState.Detached)
                Context.Documents.Attach(document);
            var entity = Context.Set<T>()
                .Include(t => t.Documents)
                .SingleOrDefault(t => t.Id == id);
            entity?.Documents.Remove(document);
            Context.Documents.Remove(document);
            Context.SaveChanges();
            File.Delete(fp);
        }

        /// <summary>
        ///     Throws an ArgumentNullException if the entity is null.
        ///     Useful in saves.
        ///     Caught by validated controller actions in the API.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entity"></param>
        protected static void ThrowIfNull<T>(T entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));
        }

        /// <summary>
        ///     Wrapper to validate and throw for testing.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entity"></param>
        /// <param name="validator"></param>
        protected static void ValidateAndThrow<T>(T entity, IValidator<T> validator)
        {
            ValidatorHelpers.ValidateAndThrow(entity, validator);
        }

        /// <summary>
        ///     Convenience method for spoofing a record quickly.
        ///     Can be used in deletes or dumping records to the
        ///     Orchestrator.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="id"></param>
        /// <returns>Returns a new record of Type T with the Id set.</returns>
        protected T Spoof<T>(int id) where T: Entity, new()
        {
            return new T {Id = id};
        }

        /// <summary>
        ///     Updates a Note.
        /// </summary>
        /// <param name="note"></param>
        protected void UpdateNote(Note note)
        {
            ThrowIfNull(note);
            ValidateAndThrow(note, new NoteValidator());
            Context.Notes.Attach(note);
            Context.SetEntityState(note, EntityState.Modified);
            Context.SaveChanges();
        }

        /// <summary>
        ///     Create's an Address for an entity implementing the IHasAddress interface.
        ///     Returns an object containing the updated rowversion of the entity, and the
        ///     id of the new Address record.
        /// </summary>
        protected CreateAddressResult CreateAddress<T>(int id, Address address) where T : Entity, IHasAddress<Address>
        {
            ThrowIfNull(address);
            ValidateAndThrow(address, new AddressValidator());
            var ent = Context.Set<T>().Find(id);
            ThrowIfNull(ent);
            Context.Addresses.Add(address);
            // ReSharper disable once PossibleNullReferenceException
            ent.Address = address;
            Context.SaveChanges();
            return new CreateAddressResult { AddressId = address.Id, Version = ent.Version };
        }

        /// <summary>
        ///     Updates an Address.
        /// </summary>
        /// <param name="address"></param>
        protected void UpdateAddress(Address address)
        {
            ThrowIfNull(address);
            ValidateAndThrow(address, new AddressValidator());
            Context.Addresses.Attach(address);
            Context.SetEntityState(address, EntityState.Modified);
            Context.SaveChanges();
        }

        /// <summary>
        ///     Deletes an Address underneath an entity implementing
        ///     the IHasAddress interface, and returns the new rowversion
        ///     of the entity.
        /// </summary>
        protected byte[] DeleteAddress<T>(int id) where T : Entity, IHasAddress<Address>
        {
            var ent = Context.Set<T>()
                .Include(e => e.Address)
                .SingleOrDefault(e => e.Id == id);
            ThrowIfNull(ent);
            // ReSharper disable once PossibleNullReferenceException
            if (ent.Address == null) return null;
            var addr = ent.Address;
            ent.Address = null;
            ent.AddressId = null;
            Context.SetEntityState(ent, EntityState.Modified);
            Context.Addresses.Remove(addr);
            Context.SaveChanges();
            return ent.Version;
        }

        /// <summary>
        /// Updates a generic model T with the generic JSON data given.
        /// Maps the field names of the JSON object to the field names on
        /// the model T.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data">The generic JSON object</param>
        protected void Update<T>(object data) where T : Entity, new()
        {
            ThrowIfNull(data);

            var dict = (IDictionary<string, object>)new JavaScriptSerializer().DeserializeObject(data.ToString());

            var obj = new T()
            {
                Id = Convert.ToInt32(dict["Id"])
            };
            Context.Set<T>().Attach(obj);
            ContextHelper.MapDictionary(dict, obj, Context);
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
        protected byte[] UpdateVersionable<T>(object data) where T : Entity, IVersionable, new()
        {
            ThrowIfNull(data);

            var dict = (IDictionary<string, object>)new JavaScriptSerializer().DeserializeObject(data.ToString());

            var obj = new T()
            {
                Id = Convert.ToInt32(dict["Id"]),
                Version = Convert.FromBase64String(dict["Version"].ToString())
            };
            Context.Set<T>().Attach(obj);
            ContextHelper.MapDictionary(dict, obj, Context);
            Context.SaveChanges();

            return obj.Version;
        }
    }
}
