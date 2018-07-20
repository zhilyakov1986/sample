CREATE TABLE [dbo].[CustomerPhones]
(
	[CustomerId] INT NOT NULL , 
    [Phone] VARCHAR(20) NOT NULL, 
    [Extension] VARCHAR(5) NOT NULL DEFAULT '', 
	[PhoneTypeId] INT NOT NULL, 
    [IsPrimary] BIT NOT NULL DEFAULT (0), 
    CONSTRAINT [FK_CustomerPhones_Customers] FOREIGN KEY ([CustomerId]) REFERENCES [Customers](Id), 
    CONSTRAINT [FK_CustomerPhones_PhoneTypes] FOREIGN KEY ([PhoneTypeId]) REFERENCES [PhoneTypes]([Id]), 
    CONSTRAINT [PK_CustomerPhones] PRIMARY KEY ([CustomerId], [Phone])
)
