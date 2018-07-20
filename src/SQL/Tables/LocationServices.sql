CREATE TABLE [dbo].[LocationServices]
(
	[Id] INT NOT NULL PRIMARY KEY identity, 
    [CustomerLocationId] INT NOT NULL, 
    [ContractId] INT NOT NULL,
    [GoodId] INT NOT NULL,
    [Quantity] INT NOT NULL,
    [Price] MONEY NOT NULL,
    [Archived] BIT NOT NULL, 
    [Version] ROWVERSION NOT NULL, 
    [ShortDescription] VARCHAR(250) NOT NULL, 
    [LongDescription] VARCHAR(MAX) NOT NULL, 
    CONSTRAINT [FK_LocationServices_CustomerLocations] FOREIGN KEY ([CustomerLocationId]) REFERENCES [CustomerLocations]([Id]), 
    CONSTRAINT [FK_LocationServices_Contracts] FOREIGN KEY ([ContractId]) REFERENCES [Contracts]([Id]), 
    CONSTRAINT [FK_LocationServices_Goods] FOREIGN KEY ([GoodId]) REFERENCES [Goods]([Id]), 
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'LocationServices',
    @level2type = N'COLUMN',
    @level2name = N'Id'
