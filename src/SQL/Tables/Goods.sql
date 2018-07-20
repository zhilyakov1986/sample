CREATE TABLE [dbo].[Goods]
(
	[Id] INT NOT NULL PRIMARY KEY identity, 
    [Name] VARCHAR(50) NOT NULL, 
    [ServiceDivisionId] INT NOT NULL, 
    [ServiceTypeId] INT NOT NULL, 
    [ServiceShortDescription] VARCHAR(250) NOT NULL, 
    [ServiceLongDescription] VARCHAR(MAX) NOT NULL, 
    [UnitTypeId] INT NOT NULL, 
    [Cost] MONEY NOT NULL, 
    [Price] MONEY NOT NULL, 
    [Taxable] BIT NOT NULL, 
    [Archived] BIT NOT NULL, 
    [Version] ROWVERSION NOT NULL, 
    CONSTRAINT [FK_Goods_ServiceDivisions] FOREIGN KEY ([ServiceDivisionId]) REFERENCES [dbo].[ServiceDivisions]([Id]), 
    CONSTRAINT [FK_Goods_ServiceTypes] FOREIGN KEY ([ServiceTypeId]) REFERENCES [dbo].[ServiceTypes]([Id]), 
    CONSTRAINT [FK_Goods_UnitTypes] FOREIGN KEY ([UnitTypeId]) REFERENCES [dbo].[UnitTypes]([Id])
)
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Goods',
    @level2type = N'COLUMN',
    @level2name = N'Id'
