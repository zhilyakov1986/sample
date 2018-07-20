/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableStatus MyTable							
			   SELECT * FROM [$(TableStatus)]					
--------------------------------------------------------------------------------------

This file should include any data that is required for the project and will not be
altered by the user.

If you would like to include dummy data, there is a separate file for that which is
conditionally executed based on the value of SQLCMD variable IncludeDummyData.

*/
-- Service Types
SET IDENTITY_INSERT dbo.ServiceTypes ON;
MERGE INTO dbo.ServiceTypes AS Target
USING ( VALUES
(1, 'Labor'),
(2, 'Material')
) AS Source(Id, Name)
ON Source.Id = Target.Id
WHEN MATCHED THEN
UPDATE SET Target.Name = Source.Name
WHEN NOT MATCHED THEN
INSERT (Id, Name) VALUES (Source.Id, Source.Name);
SET IDENTITY_INSERT dbo.ServiceTypes OFF;

-- Subcontractor Statuses
SET IDENTITY_INSERT dbo.SubcontractorStatuses ON;
MERGE INTO dbo.SubcontractorStatuses AS Target
USING ( VALUES
(1, 'Active'),
(2, 'Inactive')
) AS Source(Id, Name)
ON Source.Id = Target.Id
WHEN MATCHED THEN
UPDATE SET Target.Name = Source.Name
WHEN NOT MATCHED THEN
INSERT (Id, Name) VALUES (Source.Id, Source.Name);
SET IDENTITY_INSERT SubcontractorStatuses OFF;

-- Contract Statuses
SET IDENTITY_INSERT dbo.ContractStatuses ON;
MERGE INTO dbo.ContractStatuses AS Target
USING ( VALUES
(1, 'Pending'),
(2, 'Approved'),
(3, 'Expired'),
(4, 'Cancelled')
) AS Source(Id, Name)
ON Source.Id = Target.Id
WHEN MATCHED THEN
UPDATE SET Target.Name = Source.Name
WHEN NOT MATCHED THEN
INSERT (Id, Name) VALUES (Source.Id, Source.Name);
SET IDENTITY_INSERT ContractStatuses OFF;

-- Work Order Statuses
SET IDENTITY_INSERT dbo.WorkOrderStatuses ON;
MERGE INTO dbo.WorkOrderStatuses AS Target
USING ( VALUES
(1, 'In Progress'),
(2, 'Completed'),
(3, 'Invoiced'),
(4, 'Cancelled')
) AS Source(Id, Name)
ON Source.Id = Target.Id
WHEN MATCHED THEN
UPDATE SET Target.Name = Source.Name
WHEN NOT MATCHED THEN
INSERT (Id, Name) VALUES (Source.Id, Source.Name);
SET IDENTITY_INSERT WorkOrderStatuses OFF;

-- Merge Auth Application Types
MERGE INTO dbo.AuthApplicationTypes AS Target
USING (
VALUES
	( 1 ,
	  'Native - Confidential'
	),
	( 2 ,
	  'Unconfidential'
	) ) AS Source ( Id, Name )
ON Target.Id = Source.Id 
-- update matched rows 
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name 
-- insert new rows 
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name )
	VALUES ( Id, Name ) 
-- DELETEe rows that are in the target but not the source 
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;

-- Merge AuthClients
DECLARE @salt VARBINARY(64) ,
	@hash VARBINARY(64) ,
	@saltedHash VARBINARY(64);
SET @salt = CRYPT_GEN_RANDOM(64);
SET @hash = HASHBYTES('SHA2_512', 'verysecret');
SET @saltedHash = HASHBYTES('SHA2_512', @salt + @hash);

SET IDENTITY_INSERT dbo.AuthClients ON;
MERGE INTO dbo.AuthClients AS Target
USING (
VALUES
	( 1 ,
	  N'angular-admin' ,
	  @saltedHash ,
	  @salt ,
	  N'The admin site.' ,
	  1 ,
	  1776 ,
	  N'*'
	) ) AS Source ( [Id], [Name], [Secret], [Salt], [Description],
					[AuthApplicationTypeId], [RefreshTokenMinutes],
					[AllowedOrigin] )
ON Target.Id = Source.Id
-- update matched rows 
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name ,
			   [Secret] = Source.[Secret] ,
			   Salt = Source.[Salt] ,
			   Target.[Description] = Source.[Description] ,
			   Target.AuthApplicationTypeId = Source.AuthApplicationTypeId ,
			   Target.RefreshTokenMinutes = Source.RefreshTokenMinutes ,
			   Target.AllowedOrigin = Source.AllowedOrigin
-- insert new rows 
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [Id] ,
			 [Name] ,
			 [Secret] ,
			 [Salt] ,
			 [Description] ,
			 [AuthApplicationTypeId] ,
			 [RefreshTokenMinutes] ,
			 [AllowedOrigin]
		   )
	VALUES ( [Id] ,
			 [Name] ,
			 [Secret] ,
			 [Salt] ,
			 [Description] ,
			 [AuthApplicationTypeId] ,
			 [RefreshTokenMinutes] ,
			 [AllowedOrigin]
		   )
-- DELETE rows that are in the target but not the source 
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;
SET IDENTITY_INSERT dbo.AuthClients OFF;

-- Merge UserRoles
SET IDENTITY_INSERT UserRoles ON;
MERGE INTO UserRoles AS Target
USING (VALUES
	(1, 'Administrator',0),
(2, 'Manager',0),
(3, 'Director',0),
(4, 'Accounting',0),
(5, 'Subcontractor',0)
) AS Source([Id], [Name], [IsEditable])
ON (Target.Id = Source.Id)
WHEN MATCHED THEN UPDATE SET
	Name = Source.Name,
	Target.IsEditable = Source.IsEditable
WHEN NOT MATCHED BY TARGET THEN
	INSERT (Id, Name, IsEditable)
	VALUES (Source.Id, Source.Name, Source.IsEditable);
SET IDENTITY_INSERT UserRoles OFF;

-- Auth User
SET @salt = CRYPT_GEN_RANDOM(64);
SET @hash = HASHBYTES('SHA2_512', 'admin');
SET @saltedHash = HASHBYTES('SHA2_512', @salt + @hash);
DECLARE @hasAccess BIT = CASE WHEN '$(AllowAdminDirectLogin)' = 'True' THEN 1 ELSE 0 END;
SET IDENTITY_INSERT [AuthUsers] ON;
MERGE INTO [AuthUsers] AS Target
USING (
VALUES
	( 1 ,'admin' ,@saltedHash ,@salt ,0x,1, 0, @hasAccess)
	 ) AS Source ( [Id], [Username], [Password], [Salt], [ResetKey], [RoleId], [IsEditable], [HasAccess] )
ON ( Target.[Id] = Source.[Id] )
WHEN MATCHED THEN
	UPDATE SET [Username] = Source.[Username] ,
			   [Password] = Source.[Password] ,
			   [Salt] = Source.[Salt] ,
			   [ResetKey] = Source.[ResetKey] ,
			   [RoleId] = SOURCE.[RoleId],
			   [IsEditable] = SOURCE.[IsEditable],
			   [HasAccess] = SOURCE.[HasAccess]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [Id] ,
			 [Username] ,
			 [Password] ,
			 [Salt] ,
			 [ResetKey] ,
			 [RoleId],
			 [IsEditable],
			 [HasAccess]
		   )
	VALUES ( Source.[Id] ,
			 Source.[Username] ,
			 Source.[Password] ,
			 Source.[Salt] ,
			 Source.[ResetKey] ,
			 Source.[RoleId],
			 SOURCE.[IsEditable],
			 SOURCE.[HasAccess]
		   );
SET IDENTITY_INSERT [AuthUsers] OFF;

-- States
MERGE INTO dbo.States AS Target
USING (
VALUES
	( 'Alaska' , 'AK'),
	( 'Alabama' , 'AL'),
	( 'American Samoa' , 'AS'),
	( 'Arizona' , 'AZ'),
	( 'Arkansas' , 'AR'),
	( 'California' , 'CA'),
	( 'Colorado' , 'CO'),
	( 'Connecticut' , 'CT'),
	( 'Delaware' , 'DE'),
	( 'District of Columbia' , 'DC'),
	( 'Florida' , 'FL'),
	( 'Georgia' , 'GA'),
	( 'Guam' , 'GU'),
	( 'Hawaii' , 'HI'),
	( 'Idaho' , 'ID'),
	( 'Illinois' , 'IL'),
	( 'Indiana' , 'IN'),
	( 'Iowa' , 'IA'),
	( 'Kansas' , 'KS'),
	( 'Kentucky' , 'KY'),
	( 'Louisiana' , 'LA'),
	( 'Maine' , 'ME'),
	( 'Maryland' , 'MD'),
	( 'Massachusetts' , 'MA'),
	( 'Michigan' , 'MI'),
	( 'Minnesota' , 'MN'),
	( 'Mississippi' , 'MS'),
	( 'Missouri' , 'MO'),
	( 'Montana' , 'MT'),
	( 'Nebraska' , 'NE'),
	( 'Nevada' , 'NV'),
	( 'New Hampshire' , 'NH'),
	( 'New Jersey' , 'NJ'),
	( 'New Mexico' , 'NM'),
	( 'New York' , 'NY'),
	( 'North Carolina' , 'NC'),
	( 'North Dakota' , 'ND'),
	( 'Northern Mariana Islands' , 'MP'),
	( 'Ohio' , 'OH'),
	( 'Oklahoma' , 'OK'),
	( 'Oregon' , 'OR'),
	( 'Palau' , 'PW'),
	( 'Pennsylvania' , 'PA'),
	( 'Puerto Rico' , 'PR'),
	( 'Rhode Island' , 'RI'),
	( 'South Carolina' , 'SC'),
	( 'South Dakota' , 'SD'),
	( 'Tennessee' , 'TN'),
	( 'Texas' , 'TX'),
	( 'Utah' , 'UT'),
	( 'Vermont' , 'VT'),
	( 'Virgin Islands' , 'VI'),
	( 'Virginia' , 'VA'),
	( 'Washington' , 'WA'),
	( 'West Virginia' , 'WV'),
	( 'Wisconsin' , 'WI'),
	( 'Wyoming' , 'WY'),
	( 'Alberta' , 'AB'),
	( 'British Columbia' , 'BC'),
	( 'Manitoba' , 'MB'),
	( 'New Brunswick' , 'NB'),
	( 'Newfoundland and Labrador' , 'NL'),
	( 'Northwest Territories' , 'NT'),
	( 'Nova Scotia' , 'NS'),
	( 'Nunavut' , 'NU'),
	( 'Ontario' , 'ON'),
	( 'Prince Edward Island' , 'PE'),
	( 'Québec' , 'QC'),
	( 'Saskatchewan' , 'SK'),
	( 'Yukon Territory' , 'YT') 
	) AS SOURCE ( NAME, [STATECODE] )
ON SOURCE.[STATECODE] = Target.[StateCode]
WHEN MATCHED THEN
	UPDATE SET Target.Name = SOURCE.NAME
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [StateCode], Name )
	VALUES ( [StateCode], Name )
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;

-- Countries
MERGE INTO dbo.Countries AS Target
USING (
VALUES
        ( 'AF' , 'AFG', 'Afghanistan'),
        ( 'AL' , 'ALB', 'Albania'),
        ( 'DZ' , 'DZA', 'Algeria'),
        ( 'AS' , 'ASM', 'American Samoa'),
        ( 'AD' , 'AND', 'Andorra'),
        ( 'AO' , 'AGO', 'Angola'),
        ( 'AI' , 'AIA', 'Anguilla'),
        ( 'AQ' , 'ATA', 'Antarctica'),
        ( 'AG' , 'ATG', 'Antigua and Barbuda'),
        ( 'AR' , 'ARG', 'Argentina'),
        ( 'AM' , 'ARM', 'Armenia'),
        ( 'AW' , 'ABW', 'Aruba'),
        ( 'AU' , 'AUS', 'Australia'),
        ( 'AT' , 'AUT', 'Austria'),
        ( 'AZ' , 'AZE', 'Azerbaijan'),
        ( 'BS' , 'BHS', 'Bahamas'),
        ( 'BH' , 'BHR', 'Bahrain'),
        ( 'BD' , 'BGD', 'Bangladesh'),
        ( 'BB' , 'BRB', 'Barbados'),
        ( 'BY' , 'BLR', 'Belarus'),
        ( 'BE' , 'BEL', 'Belgium'),
        ( 'BZ' , 'BLZ', 'Belize'),
        ( 'BJ' , 'BEN', 'Benin'),
        ( 'BM' , 'BMU', 'Bermuda'),
        ( 'BT' , 'BTN', 'Bhutan'),
        ( 'BO' , 'BOL', 'Bolivia'),
        ( 'BA' , 'BIH', 'Bosnia and Herzegovina'),
        ( 'BW' , 'BWA', 'Botswana'),
        ( 'BR' , 'BRA', 'Brazil'),
        ( 'IO' , 'IOT', 'British Indian Ocean Territory'),
        ( 'VG' , 'VGB', 'British Virgin Islands'),
        ( 'BN' , 'BRN', 'Brunei'),
        ( 'BG' , 'BGR', 'Bulgaria'),
        ( 'BF' , 'BFA', 'Burkina Faso'),
        ( 'BI' , 'BDI', 'Burundi'),
        ( 'KH' , 'KHM', 'Cambodia'),
        ( 'CM' , 'CMR', 'Cameroon'),
        ( 'CA' , 'CAN', 'Canada'),
        ( 'CV' , 'CPV', 'Cape Verde'),
        ( 'KY' , 'CYM', 'Cayman Islands'),
        ( 'CF' , 'CAF', 'Central African Republic'),
        ( 'TD' , 'TCD', 'Chad'),
        ( 'CL' , 'CHL', 'Chile'),
        ( 'CN' , 'CHN', 'China'),
        ( 'CX' , 'CXR', 'Christmas Island'),
        ( 'CC' , 'CCK', 'Cocos Islands'),
        ( 'CO' , 'COL', 'Colombia'),
        ( 'KM' , 'COM', 'Comoros'),
        ( 'CK' , 'COK', 'Cook Islands'),
        ( 'CR' , 'CRI', 'Costa Rica'),
        ( 'HR' , 'HRV', 'Croatia'),
        ( 'CU' , 'CUB', 'Cuba'),
        ( 'CW' , 'CUW', 'Curacao'),
        ( 'CY' , 'CYP', 'Cyprus'),
        ( 'CZ' , 'CZE', 'Czech Republic'),
        ( 'CD' , 'COD', 'Democratic Republic of the Congo'),
        ( 'DK' , 'DNK', 'Denmark'),
        ( 'DJ' , 'DJI', 'Djibouti'),
        ( 'DM' , 'DMA', 'Dominica'),
        ( 'DO' , 'DOM', 'Dominican Republic'),
        ( 'TL' , 'TLS', 'East Timor'),
        ( 'EC' , 'ECU', 'Ecuador'),
        ( 'EG' , 'EGY', 'Egypt'),
        ( 'SV' , 'SLV', 'El Salvador'),
        ( 'GQ' , 'GNQ', 'Equatorial Guinea'),
        ( 'ER' , 'ERI', 'Eritrea'),
        ( 'EE' , 'EST', 'Estonia'),
        ( 'ET' , 'ETH', 'Ethiopia'),
        ( 'FK' , 'FLK', 'Falkland Islands'),
        ( 'FO' , 'FRO', 'Faroe Islands'),
        ( 'FJ' , 'FJI', 'Fiji'),
        ( 'FI' , 'FIN', 'Finland'),
        ( 'FR' , 'FRA', 'France'),
        ( 'PF' , 'PYF', 'French Polynesia'),
        ( 'GA' , 'GAB', 'Gabon'),
        ( 'GM' , 'GMB', 'Gambia'),
        ( 'GE' , 'GEO', 'Georgia'),
        ( 'DE' , 'DEU', 'Germany'),
        ( 'GH' , 'GHA', 'Ghana'),
        ( 'GI' , 'GIB', 'Gibraltar'),
        ( 'GR' , 'GRC', 'Greece'),
        ( 'GL' , 'GRL', 'Greenland'),
        ( 'GD' , 'GRD', 'Grenada'),
        ( 'GU' , 'GUM', 'Guam'),
        ( 'GT' , 'GTM', 'Guatemala'),
        ( 'GG' , 'GGY', 'Guernsey'),
        ( 'GN' , 'GIN', 'Guinea'),
        ( 'GW' , 'GNB', 'Guinea-Bissau'),
        ( 'GY' , 'GUY', 'Guyana'),
        ( 'HT' , 'HTI', 'Haiti'),
        ( 'HN' , 'HND', 'Honduras'),
        ( 'HK' , 'HKG', 'Hong Kong'),
        ( 'HU' , 'HUN', 'Hungary'),
        ( 'IS' , 'ISL', 'Iceland'),
        ( 'IN' , 'IND', 'India'),
        ( 'ID' , 'IDN', 'Indonesia'),
        ( 'IR' , 'IRN', 'Iran'),
        ( 'IQ' , 'IRQ', 'Iraq'),
        ( 'IE' , 'IRL', 'Ireland'),
        ( 'IM' , 'IMN', 'Isle of Man'),
        ( 'IL' , 'ISR', 'Israel'),
        ( 'IT' , 'ITA', 'Italy'),
        ( 'CI' , 'CIV', 'Ivory Coast'),
        ( 'JM' , 'JAM', 'Jamaica'),
        ( 'JP' , 'JPN', 'Japan'),
        ( 'JE' , 'JEY', 'Jersey'),
        ( 'JO' , 'JOR', 'Jordan'),
        ( 'KZ' , 'KAZ', 'Kazakhstan'),
        ( 'KE' , 'KEN', 'Kenya'),
        ( 'KI' , 'KIR', 'Kiribati'),
        ( 'XK' , 'XKX', 'Kosovo'),
        ( 'KW' , 'KWT', 'Kuwait'),
        ( 'KG' , 'KGZ', 'Kyrgyzstan'),
        ( 'LA' , 'LAO', 'Laos'),
        ( 'LV' , 'LVA', 'Latvia'),
        ( 'LB' , 'LBN', 'Lebanon'),
        ( 'LS' , 'LSO', 'Lesotho'),
        ( 'LR' , 'LBR', 'Liberia'),
        ( 'LY' , 'LBY', 'Libya'),
        ( 'LI' , 'LIE', 'Liechtenstein'),
        ( 'LT' , 'LTU', 'Lithuania'),
        ( 'LU' , 'LUX', 'Luxembourg'),
        ( 'MO' , 'MAC', 'Macau'),
        ( 'MK' , 'MKD', 'Macedonia'),
        ( 'MG' , 'MDG', 'Madagascar'),
        ( 'MW' , 'MWI', 'Malawi'),
        ( 'MY' , 'MYS', 'Malaysia'),
        ( 'MV' , 'MDV', 'Maldives'),
        ( 'ML' , 'MLI', 'Mali'),
        ( 'MT' , 'MLT', 'Malta'),
        ( 'MH' , 'MHL', 'Marshall Islands'),
        ( 'MR' , 'MRT', 'Mauritania'),
        ( 'MU' , 'MUS', 'Mauritius'),
        ( 'YT' , 'MYT', 'Mayotte'),
        ( 'MX' , 'MEX', 'Mexico'),
        ( 'FM' , 'FSM', 'Micronesia'),
        ( 'MD' , 'MDA', 'Moldova'),
        ( 'MC' , 'MCO', 'Monaco'),
        ( 'MN' , 'MNG', 'Mongolia'),
        ( 'ME' , 'MNE', 'Montenegro'),
        ( 'MS' , 'MSR', 'Montserrat'),
        ( 'MA' , 'MAR', 'Morocco'),
        ( 'MZ' , 'MOZ', 'Mozambique'),
        ( 'MM' , 'MMR', 'Myanmar'),
        ( 'NA' , 'NAM', 'Namibia'),
        ( 'NR' , 'NRU', 'Nauru'),
        ( 'NP' , 'NPL', 'Nepal'),
        ( 'NL' , 'NLD', 'Netherlands'),
        ( 'AN' , 'ANT', 'Netherlands Antilles'),
        ( 'NC' , 'NCL', 'New Caledonia'),
        ( 'NZ' , 'NZL', 'New Zealand'),
        ( 'NI' , 'NIC', 'Nicaragua'),
        ( 'NE' , 'NER', 'Niger'),
        ( 'NG' , 'NGA', 'Nigeria'),
        ( 'NU' , 'NIU', 'Niue'),
        ( 'KP' , 'PRK', 'North Korea'),
        ( 'MP' , 'MNP', 'Northern Mariana Islands'),
        ( 'NO' , 'NOR', 'Norway'),
        ( 'OM' , 'OMN', 'Oman'),
        ( 'PK' , 'PAK', 'Pakistan'),
        ( 'PW' , 'PLW', 'Palau'),
        ( 'PS' , 'PSE', 'Palestine'),
        ( 'PA' , 'PAN', 'Panama'),
        ( 'PG' , 'PNG', 'Papua New Guinea'),
        ( 'PY' , 'PRY', 'Paraguay'),
        ( 'PE' , 'PER', 'Peru'),
        ( 'PH' , 'PHL', 'Philippines'),
        ( 'PN' , 'PCN', 'Pitcairn'),
        ( 'PL' , 'POL', 'Poland'),
        ( 'PT' , 'PRT', 'Portugal'),
        ( 'PR' , 'PRI', 'Puerto Rico'),
        ( 'QA' , 'QAT', 'Qatar'),
        ( 'CG' , 'COG', 'Republic of the Congo'),
        ( 'RE' , 'REU', 'Reunion'),
        ( 'RO' , 'ROU', 'Romania'),
        ( 'RU' , 'RUS', 'Russia'),
        ( 'RW' , 'RWA', 'Rwanda'),
        ( 'BL' , 'BLM', 'Saint Barthelemy'),
        ( 'SH' , 'SHN', 'Saint Helena'),
        ( 'KN' , 'KNA', 'Saint Kitts and Nevis'),
        ( 'LC' , 'LCA', 'Saint Lucia'),
        ( 'MF' , 'MAF', 'Saint Martin'),
        ( 'PM' , 'SPM', 'Saint Pierre and Miquelon'),
        ( 'VC' , 'VCT', 'Saint Vincent and the Grenadines'),
        ( 'WS' , 'WSM', 'Samoa'),
        ( 'SM' , 'SMR', 'San Marino'),
        ( 'ST' , 'STP', 'Sao Tome and Principe'),
        ( 'SA' , 'SAU', 'Saudi Arabia'),
        ( 'SN' , 'SEN', 'Senegal'),
        ( 'RS' , 'SRB', 'Serbia'),
        ( 'SC' , 'SYC', 'Seychelles'),
        ( 'SL' , 'SLE', 'Sierra Leone'),
        ( 'SG' , 'SGP', 'Singapore'),
        ( 'SX' , 'SXM', 'Sint Maarten'),
        ( 'SK' , 'SVK', 'Slovakia'),
        ( 'SI' , 'SVN', 'Slovenia'),
        ( 'SB' , 'SLB', 'Solomon Islands'),
        ( 'SO' , 'SOM', 'Somalia'),
        ( 'ZA' , 'ZAF', 'South Africa'),
        ( 'KR' , 'KOR', 'South Korea'),
        ( 'SS' , 'SSD', 'South Sudan'),
        ( 'ES' , 'ESP', 'Spain'),
        ( 'LK' , 'LKA', 'Sri Lanka'),
        ( 'SD' , 'SDN', 'Sudan'),
        ( 'SR' , 'SUR', 'Suriname'),
        ( 'SJ' , 'SJM', 'Svalbard and Jan Mayen'),
        ( 'SZ' , 'SWZ', 'Swaziland'),
        ( 'SE' , 'SWE', 'Sweden'),
        ( 'CH' , 'CHE', 'Switzerland'),
        ( 'SY' , 'SYR', 'Syria'),
        ( 'TW' , 'TWN', 'Taiwan'),
        ( 'TJ' , 'TJK', 'Tajikistan'),
        ( 'TZ' , 'TZA', 'Tanzania'),
        ( 'TH' , 'THA', 'Thailand'),
        ( 'TG' , 'TGO', 'Togo'),
        ( 'TK' , 'TKL', 'Tokelau'),
        ( 'TO' , 'TON', 'Tonga'),
        ( 'TT' , 'TTO', 'Trinidad and Tobago'),
        ( 'TN' , 'TUN', 'Tunisia'),
        ( 'TR' , 'TUR', 'Turkey'),
        ( 'TM' , 'TKM', 'Turkmenistan'),
        ( 'TC' , 'TCA', 'Turks and Caicos Islands'),
        ( 'TV' , 'TUV', 'Tuvalu'),
        ( 'VI' , 'VIR', 'U.S. Virgin Islands'),
        ( 'UG' , 'UGA', 'Uganda'),
        ( 'UA' , 'UKR', 'Ukraine'),
        ( 'AE' , 'ARE', 'United Arab Emirates'),
        ( 'GB' , 'GBR', 'United Kingdom'),
        ( 'US' , 'USA', 'United States'),
        ( 'UY' , 'URY', 'Uruguay'),
        ( 'UZ' , 'UZB', 'Uzbekistan'),
        ( 'VU' , 'VUT', 'Vanuatu'),
        ( 'VA' , 'VAT', 'Vatican'),
        ( 'VE' , 'VEN', 'Venezuela'),
        ( 'VN' , 'VNM', 'Vietnam'),
        ( 'WF' , 'WLF', 'Wallis and Futuna'),
        ( 'EH' , 'ESH', 'Western Sahara'),
        ( 'YE' , 'YEM', 'Yemen'),
        ( 'ZM' , 'ZMB', 'Zambia'),
        ( 'ZW' , 'ZWE', 'Zimbabwe')
	) AS SOURCE ( [COUNTRYCODE], [ALPHA3CODE], [NAME] )
ON SOURCE.[COUNTRYCODE] = Target.[CountryCode]
WHEN MATCHED THEN
	UPDATE SET Target.Name = SOURCE.NAME
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [CountryCode], [Alpha3Code], Name )
	VALUES ( [CountryCode], [Alpha3Code], Name )
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;

-- User
SET IDENTITY_INSERT dbo.Users ON;
MERGE INTO Users AS Target
USING (VALUES 
(1, 'Admin', 'User', 'admin@4miles.com', NULL, 1)
) AS Source(Id, FirstName, LastName, Email, AddressId, AuthUserId)
ON Source.Id = Target.ID
WHEN MATCHED THEN
	UPDATE SET 
		Target.FirstName = source.FirstName,
		Target.LastName = source.LastName,
		Target.Email = source.Email,
		Target.AddressId = SOURCE.AddressId,
		TARGET.AuthUserId = SOURCE.AuthUserId
WHEN NOT MATCHED THEN
	INSERT(Id, FirstName, LastName, Email, AuthUserId, AddressId)
	VALUES (Source.Id, Source.FirstName, Source.LastName, Source.Email, 
	Source.AuthUserId, Source.AddressId);
SET IDENTITY_INSERT dbo.Users OFF;

-- Phone Types
SET IDENTITY_INSERT PhoneTypes ON;
MERGE INTO PhoneTypes AS Target
USING (
VALUES
	( 1 ,'Home'),
	( 2 ,'Work'),
	( 3 ,'Mobile'), 
	( 4, 'Fax')
	) AS Source ( Id, Name )
ON Target.Id = Source.Id 
-- update matched rows 
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name
-- insert new rows 
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name )
	VALUES ( Id, Name )
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT PhoneTypes OFF;

-- Claim Types
SET IDENTITY_INSERT dbo.ClaimTypes ON;
MERGE INTO dbo.ClaimTypes AS Target
USING (VALUES
	(1, 'Application Settings'),
	(2, 'Users'),
	(3, 'Customers'),
	(4, 'User Roles'),
    (5, 'Services'),
    (6, 'Goods'),
    (7, 'Contracts')
) AS Source(Id, Name)
ON Source.Id = Target.Id
WHEN MATCHED THEN UPDATE SET
	Target.Name = Source.Name
WHEN NOT MATCHED BY TARGET THEN
	INSERT (Id, Name)
	VALUES (Source.Id, Source.Name)
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT dbo.ClaimTypes OFF;

-- Claim Values
-- DO NOT USE IDENTITY SPECIFICATION!!!
-- These are bit flags. Ids must be explicitly 
-- set in powers of 2, where 0 = None.
MERGE INTO dbo.ClaimValues AS Target
USING (VALUES
	(1, 'Full Access'),
	(2, 'Read Only')
) AS Source(Id, Name)
ON Source.Id = Target.Id
WHEN MATCHED THEN
	UPDATE SET Target.Name = Source.Name
WHEN NOT MATCHED BY TARGET THEN
	INSERT (Id, Name)
	VALUES (Source.Id, Source.Name)
WHEN NOT MATCHED BY SOURCE THEN DELETE;

-- give Admin Full Access Only
DELETE FROM dbo.UserRoleClaims WHERE RoleId = 1;
INSERT INTO dbo.UserRoleClaims
        ( RoleId ,
          ClaimTypeId ,
          ClaimValueId
        )
SELECT  1 , -- RoleId - int
        id , -- ClaimTypeId - int
        1  -- ClaimValueId - int
FROM dbo.ClaimTypes;

--Settings
SET IDENTITY_INSERT dbo.Settings ON;
MERGE INTO dbo.Settings AS TARGET
USING(VALUES(1, 'Company Name', 'Miles Technologies'))
AS SOURCE([Id],[Name], [Value])
ON SOURCE.Id = TARGET.Id
WHEN NOT MATCHED BY TARGET THEN
	INSERT([Id], [Name], [Value])
	VALUES([Id], [Name], [Value]);
SET IDENTITY_INSERT dbo.Settings OFF;

-- Merge Customer Statuses
SET IDENTITY_INSERT dbo.CustomerStatuses ON;
MERGE INTO CustomerStatuses AS Target
USING (
VALUES
	( 1 ,
	  'Current'
	),
	( 2 ,
	  'Lost'
	),
	( 3 ,
	  'Prospect'
	) ) AS Source ( Id, Name )
ON Target.Id = Source.Id 
-- update matched rows 
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name
-- insert new rows 
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name )
	VALUES ( Id, Name );
SET IDENTITY_INSERT dbo.CustomerStatuses OFF;

-- Customer Source
SET IDENTITY_INSERT CustomerSources ON;
MERGE INTO dbo.CustomerSources AS Target
USING (
	VALUES (1, 'Interwebs'),
	(2, 'Craigslist'),
	(3, 'Moon Billboard'),
	(4, 'Andy''s Diary')
) AS Source(Id, Name)
ON Source.Id = Target.Id
WHEN MATCHED THEN UPDATE SET
	Name = Source.Name
WHEN NOT MATCHED THEN INSERT (Id, Name) VALUES (Source.Id, Source.Name);
SET IDENTITY_INSERT CustomerSources OFF;

-- Contact Statuses
SET IDENTITY_INSERT dbo.ContactStatuses ON;
MERGE INTO dbo.ContactStatuses AS Target
USING ( VALUES 
(1, 'Poppin'),
(2, 'Lockin')
) AS Source(Id, Name)
ON Source.Id = Target.Id
WHEN MATCHED THEN
UPDATE SET Target.Name = Source.Name
WHEN NOT MATCHED THEN
INSERT (Id, Name) VALUES (Source.Id, Source.Name);
SET IDENTITY_INSERT dbo.ContactStatuses OFF;

IF ('$(IncludeDummyData)' = 'True')
BEGIN
:r .\IncludeDummyData.sql
END


