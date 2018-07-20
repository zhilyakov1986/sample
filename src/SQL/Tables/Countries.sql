CREATE TABLE [dbo].[Countries]
(
	[CountryCode] CHAR(2) NOT NULL PRIMARY KEY, 
    [Alpha3Code] CHAR(3) NOT NULL, 
    [Name] VARCHAR(50) NOT NULL
)
