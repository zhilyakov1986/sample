CREATE TABLE [dbo].[CustomerLocationAddresses]
(
	[CustomerLocationId] INT NOT NULL, 
    [AddressId] INT NOT NULL,
    [IsPrimary] BIT NOT NULL DEFAULT ((0)), 
    CONSTRAINT [PK_CustomerLocationAddresses] PRIMARY KEY CLUSTERED ([CustomerLocationId] ASC, [AddressId] ASC),
CONSTRAINT [FK_CustomerLocationAddresses_Addresses] FOREIGN KEY ([AddressId]) REFERENCES [dbo].[Addresses] ([Id]),
    CONSTRAINT [FK_CustomerLocationAddresses_CustomerLocations] FOREIGN KEY ([CustomerLocationId]) REFERENCES [dbo].[CustomerLocations] ([Id])
);
