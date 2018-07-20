CREATE TABLE [dbo].[Contacts]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [FirstName] VARCHAR(50) NOT NULL, 
    [LastName] VARCHAR(50) NOT NULL, 
    [Title] VARCHAR(50) NOT NULL DEFAULT '', 
    [Email] VARCHAR(50) NOT NULL DEFAULT '', 
    [AddressId] INT NULL, 
    [StatusId] INT NOT NULL, 
    CONSTRAINT [FK_Contacts_Addresses] FOREIGN KEY ([AddressId]) REFERENCES [Addresses]([Id]), 
    CONSTRAINT [FK_Contacts_ContactStatuses] FOREIGN KEY ([StatusId]) REFERENCES [ContactStatuses]([Id])
)
