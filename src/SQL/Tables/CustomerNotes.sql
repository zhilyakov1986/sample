CREATE TABLE [dbo].[CustomerNotes]
(
	[CustomerId] INT NOT NULL , 
    [NoteId] INT NOT NULL, 
    PRIMARY KEY ([NoteId], [CustomerId]), 
    CONSTRAINT [FK_CustomerNotes_Customers] FOREIGN KEY ([CustomerId]) REFERENCES [Customers]([Id]), 
    CONSTRAINT [FK_CustomerNotes_Notes] FOREIGN KEY ([NoteId]) REFERENCES [Notes]([Id])
)
