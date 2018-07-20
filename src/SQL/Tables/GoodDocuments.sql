CREATE TABLE [dbo].[GoodDocuments]
(
	[GoodId] INT NOT NULL, 
    [DocumentId] INT NOT NULL,
    PRIMARY KEY ([GoodId], [DocumentId]), 
    CONSTRAINT [FK_GoodDocuments_Goods] FOREIGN KEY ([GoodId]) REFERENCES [Goods]([Id]), 
    CONSTRAINT [FK_GoodDocuments_Documents] FOREIGN KEY ([DocumentId]) REFERENCES [Documents]([Id])
)
