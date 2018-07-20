using System;

namespace Service.Utilities
{
    public static class EntityHelper
    {
        /// <summary>
        /// Sets all properties from the in object to the corresponding property
        /// name on the update object (assumes that types are the same between objects)
        /// </summary>
        /// <param name="inObject">The object containing the new values</param>
        /// <param name="updateObj">The object being updated</param>
        public static void MapProperties(object inObject, object updateObj)
        {
            foreach (var prop in inObject.GetType().GetProperties())
            {
                SetPropValue(updateObj, prop.Name, GetPropValue(inObject, prop.Name));
            }
        }

        public static void SetPropValue(object obj, string propName, object newValue)
        {
            var prop = obj.GetType().GetProperty(propName);
            if (prop == null) return;
            if ((prop.PropertyType == typeof(int) || prop.PropertyType == typeof(int?)) && newValue is string)
            {
                // try to convert to int
                prop.SetValue(obj, Convert.ToInt32(newValue));
            }
            else if ((prop.PropertyType == typeof(DateTime) || prop.PropertyType == typeof(DateTime?)) && newValue is string)
            {
                // try to parse the string into a date
                prop.SetValue(obj, DateTime.Parse(newValue.ToString()));
            }
            else if ((prop.PropertyType == typeof(decimal) || prop.PropertyType == typeof(decimal?)
                || prop.PropertyType == typeof(float) || prop.PropertyType == typeof(float?)
                || prop.PropertyType == typeof(double) || prop.PropertyType == typeof(double?)) && newValue is string)
            {
                // try to convert to decimal
                prop.SetValue(obj, Convert.ToDecimal(newValue));
            }
            else if (prop.PropertyType == typeof(byte[]) && newValue is string)
            {
                // try to convert from base64
                prop.SetValue(obj, Convert.FromBase64String(newValue.ToString()));
            }
            else
            {
                prop.SetValue(obj, newValue);
            }
        }

        public static object GetPropValue(object obj, string propName)
        {
            return obj.GetType().GetProperty(propName).GetValue(obj);
        }

    }
}
