CREATE TABLE [dbo].[UserServiceAreas]
(
	[UserId] INT NOT NULL , 
    [ServiceAreaId] INT NOT NULL,
    primary key ([UserId], [ServiceAreaId]), 
    CONSTRAINT [FK_UserServiceAreas_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]), 
    CONSTRAINT [FK_UserServiceAreas_ServiceAreas] FOREIGN KEY ([ServiceAreaId]) REFERENCES [ServiceAreas]([Id]),
    
)
