CREATE TABLE [dbo].[CustomerLocationDocuments]
(
	[CustomerLocationId] INT NOT NULL, 
    [DocumentId] INT NOT NULL,
    PRIMARY KEY ([CustomerLocationId], [DocumentId]), 
    CONSTRAINT [FK_CustomerLocationDocuments_CustomerLocations] FOREIGN KEY ([CustomerLocationId]) REFERENCES [CustomerLocations]([Id]), 
    CONSTRAINT [FK_CustomerLocationDocuments_Documents] FOREIGN KEY ([DocumentId]) REFERENCES [Documents]([Id])
)
