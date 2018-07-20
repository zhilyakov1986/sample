CREATE TABLE [dbo].[CustomerDocuments]
(
	[CustomerId] INT NOT NULL , 
    [DocumentId] INT NOT NULL, 
    PRIMARY KEY ([CustomerId], [DocumentId]), 
    CONSTRAINT [FK_CustomerDocuments_Customers] FOREIGN KEY ([CustomerId]) REFERENCES [Customers]([Id]), 
    CONSTRAINT [FK_CustomerDocuments_Documents] FOREIGN KEY ([DocumentId]) REFERENCES [Documents]([Id])
)
