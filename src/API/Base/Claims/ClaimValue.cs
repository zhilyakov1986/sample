using System;

namespace API.Claims
{
    /// <summary>
    ///     Bitwise flags that represent
    ///     access to controllers and actions.
    ///     Must be in powers of 2.
    ///     Make sure to keep in sync w/ db.
    ///     The ids are encoded into the JWT.
    ///     BEWARE of adding any other id-based claims,
    ///     as they will collide unless you add some sort of prefix.
    /// </summary>
    [Flags]
    public enum ClaimValues
    {
        None = 0,
        FullAccess = 1,
        ReadOnly = 2
    }
}