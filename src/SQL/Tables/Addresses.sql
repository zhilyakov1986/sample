CREATE TABLE [dbo].[Addresses] (
    [Id]       INT          IDENTITY (1, 1) NOT NULL,
    [Address1] NVARCHAR(50) NOT NULL DEFAULT (''),
    [Address2] NVARCHAR(50) CONSTRAINT [DF_Addresses_Address2] DEFAULT ('') NOT NULL,
    [City]     NVARCHAR(50) CONSTRAINT [DF_Addresses_City] DEFAULT ('') NOT NULL,
    [StateId]    INT     NULL ,
    [Zip]      NVARCHAR(20) NOT NULL DEFAULT (''),
    [CountryCode] CHAR(2) NULL, 
    [Province] NVARCHAR(50) NOT NULL DEFAULT (''), 
    CONSTRAINT [PK_Addresses] PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_Addresses_States] FOREIGN KEY ([StateId]) REFERENCES [dbo].[States] ([Id]),
	CONSTRAINT [FK_Addresses_Countries] FOREIGN KEY ([CountryCode]) REFERENCES [dbo].[Countries] ([CountryCode])
);
