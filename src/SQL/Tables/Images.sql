﻿CREATE TABLE [dbo].[Images]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(50) NOT NULL DEFAULT '', 
    [ImagePath] VARCHAR(100) NOT NULL, 
    [ThumbnailPath] VARCHAR(100) NOT NULL 
 
)