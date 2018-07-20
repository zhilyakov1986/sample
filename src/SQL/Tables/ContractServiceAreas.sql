CREATE TABLE [dbo].[ContractServiceAreas]
(
	[ContractId] INT NOT NULL, 
    [ServiceAreaId] INT NOT NULL,
    PRIMARY KEY ([ContractId], [ServiceAreaId]),
    CONSTRAINT [FK_ContractServiceAreas_Contracts] FOREIGN KEY ([ContractId]) REFERENCES [Contracts]([Id]), 
    CONSTRAINT [FK_ContractServiceAreas_ServiceAreas] FOREIGN KEY ([ServiceAreaId]) REFERENCES [ServiceAreas]([Id]),
)
