CREATE TABLE [dbo].[CustomerLocations]
(
	[Id] INT NOT NULL PRIMARY KEY identity (1, 1), 
    [Name] VARCHAR(50) NOT NULL,
    [CustomerId] INT NULL, 
    [ServiceAreaId] INT NOT NULL, 
    [AddressId] INT NULL , 
    [Archived] BIT NOT NULL, 
    [Version] ROWVERSION NOT NULL, 
    CONSTRAINT [FK_CustomerLocations_Addresses] FOREIGN KEY ([AddressId]) REFERENCES [dbo].[Addresses] ([Id]), 
    CONSTRAINT [FK_CustomerLocations_ServiceArea] FOREIGN KEY ([ServiceAreaId]) REFERENCES [dbo].[ServiceAreas] ([Id]), 
    CONSTRAINT [FK_CustomerLocations_Customers] FOREIGN KEY ([CustomerId]) REFERENCES[dbo].[Customers] ([Id])
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'CustomerLocations',
    @level2type = N'COLUMN',
    @level2name = N'Id'
