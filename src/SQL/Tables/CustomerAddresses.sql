CREATE TABLE [dbo].[CustomerAddresses] (
    [CustomerId] INT NOT NULL,
    [AddressId]  INT NOT NULL,
    [IsPrimary]  BIT DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_CustomerAddresses] PRIMARY KEY CLUSTERED ([CustomerId] ASC, [AddressId] ASC),
    CONSTRAINT [FK_CustomerAddresses_Addresses] FOREIGN KEY ([AddressId]) REFERENCES [dbo].[Addresses] ([Id]),
    CONSTRAINT [FK_CustomerAddresses_Customers] FOREIGN KEY ([CustomerId]) REFERENCES [dbo].[Customers] ([Id])
);

