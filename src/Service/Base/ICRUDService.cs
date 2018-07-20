using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Base {
    public interface ICRUDService {

        int Create<T>(T data) where T : class, IEntity;

        IQueryable<T> Get<T>() where T : class, IEntity;

        IQueryable<T> Get<T>(string[] includes) where T : class, IEntity;

        T GetById<T>(int id) where T : class, IEntity;

        T GetById<T>(int id, string[] includes) where T : class, IEntity;

        //Updates
        void Update<T>(T data) where T : class, IEntity, new();

        void Update<T>(string data) where T : class, IEntity, new();

        void Update<T>(IEnumerable<T> itemList) where T : class, IEntity;

        void Update<T>(IEnumerable<T> itemList, Action<T, T> mapping) where T : class, IEntity;

        byte[] UpdateVersionable<T>(string data) where T : class, IEntity, IVersionable, new();

        byte[] UpdateVersionable<T>(T data) where T : class, IEntity, IVersionable, new();

        void Delete<T>(int id) where T : class, IEntity, new();

        void Delete<T>(T data) where T : class, IEntity, new();

        T Reload<T>(int id) where T : class, IEntity, new();

        bool CheckEntityInUse<T, TS>(IEnumerable<T> itemList, string foreignKeyColumnName, string entityErrorMsg) where T : class, IEntity where TS : class, IEntity;
    }
}
