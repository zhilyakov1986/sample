CREATE TABLE [dbo].[Customers] (
    [Id]       INT          IDENTITY (1, 1) NOT NULL,
    [Name]     VARCHAR (50) NOT NULL,
    [StatusId] INT          NOT NULL,
	[SourceId] INT NOT NULL, 
    [Version]  ROWVERSION   NOT NULL,
    CONSTRAINT [PK_Customers] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Customers_CustomerStatuses] FOREIGN KEY ([StatusId]) REFERENCES [dbo].[CustomerStatuses] ([Id]), 
    CONSTRAINT [FK_Customers_CustomerSources] FOREIGN KEY (SourceId) REFERENCES CustomerSources(Id)
);


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Customers',
    @level2type = N'COLUMN',
    @level2name = N'Id'
