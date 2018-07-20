CREATE TABLE [dbo].[Users]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [FirstName] VARCHAR(50) NOT NULL, 
    [LastName] VARCHAR(50) NOT NULL, 
	[Email] VARCHAR(50) NOT NULL ,
    [AuthUserId] INT NOT NULL, 
    [ImageId] INT NULL, 
	[AddressId] INT NULL, 
    [Version] ROWVERSION NOT NULL, 
    CONSTRAINT [FK_Users_AuthUsers] FOREIGN KEY (AuthUserId) REFERENCES AuthUsers(Id), 
    CONSTRAINT [FK_Users_Images] FOREIGN KEY (ImageId) REFERENCES Images(Id), 
    CONSTRAINT [FK_Users_Addresses] FOREIGN KEY (AddressId) REFERENCES Addresses(Id)
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Users',
    @level2type = N'COLUMN',
    @level2name = N'Id'
