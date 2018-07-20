using System;

namespace API.Claims
{
    /// <summary>
    ///     Bypasses the Restrict attribute for appropriate claim.
    ///     Accepts a ClaimType and OR-ed together flags for CVs.
    ///     Alternately, 
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public sealed class BypassAttribute : Attribute
    {
        public ClaimTypes ClaimType { get; set; }
        public ClaimValues ClaimValues { get; set; }
        public bool Any { get; set; }

        public BypassAttribute(ClaimTypes ct, ClaimValues cv) : this(ct, cv, false)
        {
        }

        public BypassAttribute(bool any)
        {
            Any = any;
        }

        public BypassAttribute(ClaimTypes ct, ClaimValues cv, bool any)
        {
            ClaimType = ct;
            ClaimValues = cv;
            Any = any;
        }
    }
}