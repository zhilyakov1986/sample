using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Model;

namespace Service
{
    public static class ContextMergeExtensions
    {
        public static Merger<T> Merge<T>(this IPrimaryContext ctx) where T: class
        {
            return Merger<T>.SetContext(ctx);
        }
    }

    /// <summary>
    ///     Merger. Works for one-to-many associations at the moment, 
    ///     but has not been tested with anything else yet.
    ///     The set of objects to update must NOT be tracked by
    ///     the context.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Merger<T> where T : class
  {
        private Merger(IPrimaryContext ctx)
        {
            _context = ctx;
            _existing = new T[0];
            _updates = new T[0];
            _mapUpdates = (e, u) => {};
        }

        private readonly IPrimaryContext _context;
        private IEnumerable<T> _existing;
        private IEnumerable<T> _updates;
        private Func<T, T, bool> _comparer;
        private Action<T, T> _mapUpdates;

        public static Merger<T> SetContext(IPrimaryContext ctx)
        {
            return new Merger<T>(ctx);
        }

        public Merger<T> SetExisting(IEnumerable<T> existing)
        {
            // must copy from orig, as if tracked, will throw DbConcurrencyUpdateException
            _existing = existing.ToArray(); 
            return this;
        }

        public Merger<T> SetUpdates(IEnumerable<T> updates)
        {
            _updates = updates;
            return this;
        }

        public Merger<T> MergeBy(Func<T, T, bool> comparer)
        {
            _comparer = comparer;
            return this;
        }

        public Merger<T> MapUpdatesBy(Action<T, T> mapUpdates)
        {
            _mapUpdates = mapUpdates;
            return this;
        }

        public void Merge()
        {
            Remove();
            AddOrModify();
        }

        private void AddOrModify()
        {
            if (_comparer == null)
                throw new ArgumentNullException();
            if (_updates == null)
                return;
            foreach (var u in _updates)
            {
                var p = _existing.SingleOrDefault(ep => _comparer(ep, u));
                if (p == null)
                    _context.Set<T>().Add(u);
                else if (_mapUpdates != null)
                {
                    _mapUpdates(p, u);
                    _context.SetEntityState(p, EntityState.Modified);
                }
            }
        }

        private void Remove()
        {
            if (_comparer == null)
                throw new ArgumentNullException();
            var toRemove = (_updates == null)
               ? _existing
               : _existing.Where(e => !_updates.Any(u => _comparer(e, u))).ToList();
            var enumerable = toRemove as T[] ?? toRemove.ToArray();
            foreach (var t in enumerable)
            {
                if (_context.GetEntityState(t) == EntityState.Detached)
                    _context.Set<T>().Attach(t);
            }
            _context.Set<T>().RemoveRange(enumerable);
        }
    }
}
