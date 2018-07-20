CREATE TABLE [dbo].[Contracts]
(
	[Id] INT IDENTITY (1, 1) NOT NULL PRIMARY KEY, 
    [Number] VARCHAR(50) NULL, 
    [StartDate] DATETIME NOT NULL, 
    [EndDate] DATETIME NOT NULL, 
    [CustomerId] INT NOT NULL,
    [UserId] INT,
    [StatusId] INT NOT NULL DEFAULT 1, 
    [ServiceDivisionId] INT NOT NULL , 
    [Archived] BIT NOT NULL, 
    [Version] ROWVERSION NOT NULL, 
    CONSTRAINT [FK_Contracts_Customers] FOREIGN KEY ([CustomerId]) REFERENCES [Customers]([Id]), 
    CONSTRAINT [FK_Contracts_ContractStatuses] FOREIGN KEY ([StatusId]) REFERENCES [ContractStatuses]([Id]), 
    CONSTRAINT [FK_Contracts_ServiceDivisions] FOREIGN KEY ([ServiceDivisionId]) REFERENCES [ServiceDivisions]([Id]), 
    CONSTRAINT [FK_Contracts_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id])
)
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Contracts',
    @level2type = N'COLUMN',
    @level2name = N'Id'
