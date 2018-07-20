CREATE TABLE [dbo].[CustomerContacts]
(
	[CustomerId] INT NOT NULL , 
    [ContactId] INT NOT NULL, 
    PRIMARY KEY ([ContactId], [CustomerId]), 
    CONSTRAINT [FK_CustomerContacts_Customers] FOREIGN KEY ([CustomerId]) REFERENCES [Customers]([Id]), 
    CONSTRAINT [FK_CustomerContacts_Contacts] FOREIGN KEY ([ContactId]) REFERENCES [Contacts]([Id]), 
)
