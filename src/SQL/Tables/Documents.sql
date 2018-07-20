﻿CREATE TABLE [dbo].[Documents]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(200) NOT NULL, 
    [DateUpload] DATETIME NOT NULL DEFAULT (getdate()), 
    [UploadedBy] INT NULL, 
    [FilePath] VARCHAR(200) NOT NULL, 
    CONSTRAINT [FK_Documents_Users] FOREIGN KEY ([UploadedBy]) REFERENCES Users(Id)
)
