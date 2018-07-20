using System;

// ReSharper disable once CheckNamespace
namespace API.Base.Claims
{
    [AttributeUsage(AttributeTargets.Method)]
    public sealed class AllowSelfEditAttribute : Attribute
    {
    }
}
