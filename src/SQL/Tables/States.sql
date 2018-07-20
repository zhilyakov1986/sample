CREATE TABLE [dbo].[States] (
    [Id] INT NOT NULL identity,
    [StateCode] CHAR (2)     NOT NULL,
    [Name]  VARCHAR (64) NOT NULL,
    [TaxRate] DECIMAL(7, 6) NULL , 
     
    CONSTRAINT [PK_States] PRIMARY KEY CLUSTERED ([Id])
);
