CREATE TABLE [dbo].[CustomerSources]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(50) NOT NULL, 
    [Sort] INT NOT NULL DEFAULT 0
)