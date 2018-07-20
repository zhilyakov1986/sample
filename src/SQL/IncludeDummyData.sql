print ('including dummy data')
-- User Roles
SET IDENTITY_INSERT UserRoles ON;
MERGE INTO UserRoles AS Target
USING (VALUES
	(3, 'Underling', 1),
	(4, 'Rookie-of-the-Year', 1),
	(5, 'Captain', 1)
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
SET IDENTITY_INSERT [AuthUsers] ON;
MERGE INTO [AuthUsers] AS Target
USING (
VALUES
	( 2 ,'wtaft' ,@saltedHash ,@salt ,0x,1, 1),
	( 3 ,'gcleveland' ,@saltedHash ,@salt ,0x,1, 1),
	( 4 ,'gwashington' ,@saltedHash ,@salt ,0x,1, 1),
	( 5 ,'rhayes' ,@saltedHash ,@salt ,0x,1, 1),
	( 6 ,'htruman' ,@saltedHash ,@salt ,0x,1, 1),
	( 7 ,'froosevelt' ,@saltedHash ,@salt ,0x,1, 1),
	( 8 ,'ctaft' ,@saltedHash ,@salt ,0x,1, 1),
	( 9 ,'wharrison' ,@saltedHash ,@salt ,0x,1, 1),
	( 10 ,'mvanburen' ,@saltedHash ,@salt ,0x,1, 1),
	( 11 ,'ztaylor' ,@saltedHash ,@salt ,0x,1, 1),
	( 12 ,'jpolk' ,@saltedHash ,@salt ,0x,1, 1)
	 ) AS Source ( [Id], [Username], [Password], [Salt], [ResetKey], [RoleId], [IsEditable] )
ON ( Target.[Id] = Source.[Id] )
WHEN MATCHED THEN
	UPDATE SET [Username] = Source.[Username] ,
			   [Password] = Source.[Password] ,
			   [Salt] = Source.[Salt] ,
			   [ResetKey] = Source.[ResetKey] ,
			   [RoleId] = SOURCE.[RoleId],
			   [IsEditable] = SOURCE.[IsEditable]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [Id] ,
			 [Username] ,
			 [Password] ,
			 [Salt] ,
			 [ResetKey] ,
			 [RoleId],
			 [IsEditable]
		   )
	VALUES ( Source.[Id] ,
			 Source.[Username] ,
			 Source.[Password] ,
			 Source.[Salt] ,
			 Source.[ResetKey] ,
			 Source.[RoleId],
			 [IsEditable]
		   );
SET IDENTITY_INSERT [AuthUsers] OFF;

-- Addresses
--SET IDENTITY_INSERT [Addresses] ON;
--MERGE INTO [Addresses] AS Target
--USING (
--VALUES
--	( 1 , '0 Grasskamp Place' , '' , 'Bloomington' , 'IL' , '61709', 'US', '')
-- ,  ( 2 , '140 Mallory Court' , '' , 'Saint Louis' , 'MO' , '63158', 'US', '')
-- ,  ( 3 , '3 Vahlen Parkway' , '' , 'Salt Lake City' , 'UT' , '84189', 'US', '')
-- ,  ( 4 , '9436 6th Court' , '' , 'Carol Stream' , 'IL' , '60158', 'US', '')
-- ,  ( 5 , '86 Sundown Drive' , '' , 'Topeka' , 'KS' , '66667', 'US', '')
-- ,  ( 6 , '2160 Manley Circle' , '' , 'Orange' , 'CA' , '92862', 'US', '')
-- ,  ( 7 , '3 Laurel Alley' , '' , 'Modesto' , 'CA' , '95354', 'US', '')
-- ,  ( 8 , '7 Mandrake Plaza' , '' , 'Farmington' , 'MI' , '48335', 'US', '')
-- ,  ( 9 , '98862 Nevada Court' , '' , 'Houston' , 'TX' , '77276', 'US', '')
-- ,  ( 10 , '7 7th Junction' , '' , 'Dallas' , 'TX' , '75205', 'US', '')
-- ,  ( 11 , '5 Blue Bill Park Pass' , '' , 'Providence' , 'RI' , '02912', 'US', '')
-- ,  ( 12 , '379 Sachs Junction' , '' , 'Little Rock' , 'AR' , '72204', 'US', '')
-- ,  ( 13 , '615 Corben Court' , '' , 'Phoenix' , 'AZ' , '85045', 'US', '')
-- ,  ( 14 , '2 Fisk Street' , '' , 'Washington' , 'DC' , '20404', 'US', '')
-- ,  ( 15 , '169 Bobwhite Way' , '' , 'Orlando' , 'FL' , '32825', 'US', '')
-- ,  ( 16 , '9 Bluejay Way' , '' , 'Milwaukee' , 'WI' , '53205', 'US', '')
-- ,  ( 17 , '6 Meadow Vale Pass' , '' , 'San Antonio' , 'TX' , '78255', 'US', '')
-- ,  ( 18 , '30 Eastlawn Terrace' , '' , 'Jersey City' , 'NJ' , '07310', 'US', '')
-- ,  ( 19 , '590 Granby Court' , '' , 'Inglewood' , 'CA' , '90310', 'US', '')
-- ,  ( 20 , '6 Hintze Parkway' , '' , 'Saint Louis' , 'MO' , '63143', 'US', '')
-- ,  ( 21 , '3 Vermont Avenue' , '' , 'Roanoke' , 'VA' , '24029', 'US', '')
-- ,  ( 22 , '82235 Utah Point' , '' , 'Oxnard' , 'CA' , '93034', 'US', '')
-- ,  ( 23 , '9053 Macpherson Way' , '' , 'Knoxville' , 'TN' , '37924', 'US', '')
-- ,  ( 24 , '41 Jana Crossing' , '' , 'Jacksonville' , 'FL' , '32230', 'US', '')
-- ,  ( 25 , '56083 American Point' , '' , 'Atlanta' , 'GA' , '30375', 'US', '')
-- ,  ( 26 , '96568 Mccormick Road' , '' , 'Hamilton' , 'OH' , '45020', 'US', '')
-- ,  ( 27 , '75383 Manufacturers Center' , '' , 'Birmingham' , 'AL' , '35290', 'US', '')
-- ,  ( 28 , '6 Starling Road' , '' , 'Amarillo' , 'TX' , '79159', 'US', '')
-- ,  ( 29 , '4313 Algoma Avenue' , '' , 'Loretto' , 'MN' , '55598', 'US', '')
-- ,  ( 30 , '665 Maryland Avenue' , '' , 'San Diego' , 'CA' , '92186', 'US', '')
-- ,  ( 31 , '5827 Commercial Trail' , '' , 'Vancouver' , 'WA' , '98664', 'US', '')
-- ,  ( 32 , '34306 Scoville Trail' , '' , 'Valdosta' , 'GA' , '31605', 'US', '')
-- ,  ( 33 , '86583 Sommers Court' , '' , 'Lancaster' , 'PA' , '17622', 'US', '')
-- ,  ( 34 , '4294 Monument Hill' , '' , 'Philadelphia' , 'PA' , '19196', 'US', '')
-- ,  ( 35 , '15317 Sage Pass' , '' , 'Jackson' , 'MS' , '39216', 'US', '')
-- ,  ( 36 , '81 Carey Court' , '' , 'San Angelo' , 'TX' , '76905', 'US', '')
-- ,  ( 37 , '24 Declaration Way' , '' , 'Portland' , 'OR' , '97271', 'US', '')
-- ,  ( 38 , '947 Anhalt Drive' , '' , 'Cleveland' , 'OH' , '44191', 'US', '')
-- ,  ( 39 , '02 Sachs Park' , '' , 'San Bernardino' , 'CA' , '92415', 'US', '')
-- ,  ( 40 , '9484 Melby Hill' , '' , 'Pueblo' , 'CO' , '81015', 'US', '')
-- ,  ( 41 , '37 Talisman Parkway' , '' , 'Sandy' , 'UT' , '84093', 'US', '')
-- ,  ( 42 , '52 Delaware Park' , '' , 'Arlington' , 'VA' , '22205', 'US', '')
-- ,  ( 43 , '22617 Briar Crest Plaza' , '' , 'Cleveland' , 'OH' , '44118', 'US', '')
-- ,  ( 44 , '410 Independence Alley' , '' , 'Lincoln' , 'NE' , '68505', 'US', '')
-- ,  ( 45 , '7553 Vermont Junction' , '' , 'Sioux Falls' , 'SD' , '57193', 'US', '')
-- ,  ( 46 , '50608 Beilfuss Trail' , '' , 'Tampa' , 'FL' , '33605', 'US', '')
-- ,  ( 47 , '4387 Emmet Alley' , '' , 'Baltimore' , 'MD' , '21282', 'US', '')
-- ,  ( 48 , '715 Doe Crossing Hill' , '' , 'Fairbanks' , 'AK' , '99709', 'US', '')
-- ,  ( 49 , '1 Express Crossing' , '' , 'Nashville' , 'TN' , '37220', 'US', '')
-- ,  ( 50 , '7352 Kingsford Park' , '' , 'Providence' , 'RI' , '02905', 'US', '')
-- ,  ( 51 , '8 Mccormick Street' , '' , 'Denver' , 'CO' , '80217', 'US', '')
-- ,  ( 52 , '783 John Wall Park' , '' , 'San Antonio' , 'TX' , '78285', 'US', '')
-- ,  ( 53 , '14 Porter Trail' , '' , 'Durham' , 'NC' , '27710', 'US', '')
-- ,  ( 54 , '79 Prairie Rose Lane' , '' , 'Canton' , 'OH' , '44720', 'US', '')
-- ,  ( 55 , '92295 Barby Lane' , '' , 'Dallas' , 'TX' , '75246', 'US', '')
-- ,  ( 56 , '948 West Drive' , '' , 'Charleston' , 'WV' , '25362', 'US', '')
-- ,  ( 57 , '71927 Scofield Drive' , '' , 'Mc Keesport' , 'PA' , '15134', 'US', '')
-- ,  ( 58 , '25 Lotheville Drive' , '' , 'Zephyrhills' , 'FL' , '33543', 'US', '')
-- ,  ( 59 , '8148 Nevada Circle' , '' , 'San Antonio' , 'TX' , '78235', 'US', '')
-- ,  ( 60 , '42 Dovetail Circle' , '' , 'Santa Cruz' , 'CA' , '95064', 'US', '')
-- ,  ( 61 , '13938 Declaration Pass' , '' , 'Louisville' , 'KY' , '40250', 'US', '')
-- ,  ( 62 , '7781 Commercial Crossing' , '' , 'Sacramento' , 'CA' , '95852', 'US', '')
-- ,  ( 63 , '592 Randy Trail' , '' , 'El Paso' , 'TX' , '79999', 'US', '')
-- ,  ( 64 , '63 Carey Avenue' , '' , 'Syracuse' , 'NY' , '13210', 'US', '')
-- ,  ( 65 , '2 Union Terrace' , '' , 'Columbus' , 'GA' , '31904', 'US', '')
-- ,  ( 66 , '0 Spaight Place' , '' , 'Billings' , 'MT' , '59105', 'US', '')
-- ,  ( 67 , '9 Schmedeman Center' , '' , 'Jackson' , 'MS' , '39204', 'US', '')
-- ,  ( 68 , '72 Manley Street' , '' , 'North Little Rock' , 'AR' , '72118', 'US', '')
-- ,  ( 69 , '663 Service Junction' , '' , 'Las Vegas' , 'NV' , '89125', 'US', '')
-- ,  ( 70 , '4765 High Crossing Point' , '' , 'Arvada' , 'CO' , '80005', 'US', '')
-- ,  ( 71 , '50 Birchwood Parkway' , '' , 'Sacramento' , 'CA' , '94280', 'US', '')
-- ,  ( 72 , '9 Dapin Drive' , '' , 'Shreveport' , 'LA' , '71161', 'US', '')
-- ,  ( 73 , '94757 Jana Drive' , '' , 'Dallas' , 'TX' , '75367', 'US', '')
-- ,  ( 74 , '1046 Rockefeller Way' , '' , 'Sacramento' , 'CA' , '95828', 'US', '')
-- ,  ( 75 , '6 Ohio Way' , '' , 'Burbank' , 'CA' , '91520', 'US', '')
-- ,  ( 76 , '387 Sheridan Parkway' , '' , 'Virginia Beach' , 'VA' , '23454', 'US', '')
-- ,  ( 77 , '6 Ludington Parkway' , '' , 'Canton' , 'OH' , '44720', 'US', '')
-- ,  ( 78 , '214 Hoffman Hill' , '' , 'Seattle' , 'WA' , '98109', 'US', '')
-- ,  ( 79 , '265 Kipling Way' , '' , 'San Luis Obispo' , 'CA' , '93407', 'US', '')
-- ,  ( 80 , '84 Reinke Alley' , '' , 'Des Moines' , 'IA' , '50305', 'US', '')
-- ,  ( 81 , '4839 Jackson Road' , '' , 'Hayward' , 'CA' , '94544', 'US', '')
-- ,  ( 82 , '7 Mandrake Avenue' , '' , 'Hattiesburg' , 'MS' , '39404', 'US', '')
-- ,  ( 83 , '09 Leroy Trail' , '' , 'Fort Worth' , 'TX' , '76115', 'US', '')
-- ,  ( 84 , '6 Delladonna Plaza' , '' , 'El Paso' , 'TX' , '88569', 'US', '')
-- ,  ( 85 , '767 Granby Plaza' , '' , 'Seattle' , 'WA' , '98104', 'US', '')
-- ,  ( 86 , '65649 Luster Hill' , '' , 'Cincinnati' , 'OH' , '45296', 'US', '')
-- ,  ( 87 , '3 Blaine Crossing' , '' , 'Jefferson City' , 'MO' , '65105', 'US', '')
-- ,  ( 88 , '8977 Hooker Circle' , '' , 'Saint Petersburg' , 'FL' , '33731', 'US', '')
-- ,  ( 89 , '955 Pierstorff Avenue' , '' , 'Hayward' , 'CA' , '94544', 'US', '')
-- ,  ( 90 , '73 Monica Plaza' , '' , 'Fort Wayne' , 'IN' , '46852', 'US', '')
-- ,  ( 91 , '72915 Service Circle' , '' , 'Dallas' , 'TX' , '75241', 'US', '')
-- ,  ( 92 , '55093 Fordem Terrace' , '' , 'Raleigh' , 'NC' , '27610', 'US', '')
-- ,  ( 93 , '96900 Victoria Plaza' , '' , 'Fayetteville' , 'NC' , '28305', 'US', '')
-- ,  ( 94 , '91 Farmco Terrace' , '' , 'Denver' , 'CO' , '80223', 'US', '')
-- ,  ( 95 , '586 Chive Court' , '' , 'Toledo' , 'OH' , '43699', 'US', '')
-- ,  ( 96 , '29337 Transport Way' , '' , 'Charleston' , 'WV' , '25331', 'US', '')
-- ,  ( 97 , '149 Logan Road' , '' , 'Virginia Beach' , 'VA' , '23454', 'US', '')
-- ,  ( 98 , '875 Summerview Terrace' , '' , 'Memphis' , 'TN' , '38188', 'US', '')
-- ,  ( 99 , '161 Bowman Road' , '' , 'Whittier' , 'CA' , '90610', 'US', '')
-- ,  ( 100 , '8 Cardinal Hill' , '' , 'Tuscaloosa' , 'AL' , '35487', 'US', '')
-- ,  ( 101 , '53613 Merry Hill' , '' , 'Charleston' , 'SC' , '29424', 'US', '')
-- ,  ( 102 , '4369 Fuller Pass' , '' , 'Bridgeport' , 'CT' , '06606', 'US', '')
-- ,  ( 103 , '2102 Bartelt Crossing' , '' , 'Hollywood' , 'FL' , '33028', 'US', '')
-- ,  ( 104 , '416 Oak Park' , '' , 'Cincinnati' , 'OH' , '45999', 'US', '')
-- ,  ( 105 , '8112 Badeau Hill' , '' , 'Canton' , 'OH' , '44760', 'US', '')
-- ,  ( 106 , '781 Barnett Pass' , '' , 'Tacoma' , 'WA' , '98442', 'US', '')
-- ,  ( 107 , '4399 Pepper Wood Parkway' , '' , 'Springfield' , 'IL' , '62723', 'US', '')
-- ,  ( 108 , '31250 Heffernan Alley' , '' , 'San Antonio' , 'TX' , '78240', 'US', '')
-- ,  ( 109 , '4 Larry Court' , '' , 'Fort Lauderdale' , 'FL' , '33336', 'US', '')
-- ,  ( 110 , '842 Spaight Street' , '' , 'Cambridge' , 'MA' , '02142', 'US', '')
-- ,  ( 111 , '1614 Delladonna Junction' , '' , 'Huntington' , 'WV' , '25770', 'US', '')
-- ,  ( 112 , '28859 Golf Course Park' , '' , 'Delray Beach' , 'FL' , '33448', 'US', '')
-- ,  ( 113 , '9708 Dawn Lane' , '' , 'Houston' , 'TX' , '77040', 'US', '')
-- ,  ( 114 , '708 Macpherson Drive' , '' , 'Lancaster' , 'PA' , '17605', 'US', '')
-- ,  ( 115 , '0309 Laurel Road' , '' , 'Fort Worth' , 'TX' , '76162', 'US', '')
-- ,  ( 116 , '27 Fulton Crossing' , '' , 'Fairfax' , 'VA' , '22036', 'US', '')
-- ,  ( 117 , '93 Lillian Terrace' , '' , 'Tacoma' , 'WA' , '98447', 'US', '')
-- ,  ( 118 , '1 Anniversary Junction' , '' , 'Waterbury' , 'CT' , '06726', 'US', '')
-- ,  ( 119 , '196 Burrows Street' , '' , 'Loretto' , 'MN' , '55598', 'US', '')
-- ,  ( 120 , '821 Mendota Hill' , '' , 'Tampa' , 'FL' , '33633', 'US', '')
-- ,  ( 121 , '924 Stone Corner Hill' , '' , 'Tampa' , 'FL' , '33694', 'US', '')
-- ,  ( 122 , '2618 Sutteridge Pass' , '' , 'Nashville' , 'TN' , '37205', 'US', '')
-- ,  ( 123 , '531 Starling Park' , '' , 'Wichita' , 'KS' , '67230', 'US', '')
-- ,  ( 124 , '38547 Kinsman Road' , '' , 'Newark' , 'NJ' , '07112', 'US', '')
-- ,  ( 125 , '61548 Express Point' , '' , 'Phoenix' , 'AZ' , '85099', 'US', '')
-- ,  ( 126 , '87 Sloan Place' , '' , 'Corpus Christi' , 'TX' , '78405', 'US', '')
-- ,  ( 127 , '6 Kropf Parkway' , '' , 'Gulfport' , 'MS' , '39505', 'US', '')
-- ,  ( 128 , '140 Burrows Hill' , '' , 'Los Angeles' , 'CA' , '90076', 'US', '')
-- ,  ( 129 , '49 Pepper Wood Alley' , '' , 'Washington' , 'DC' , '20226', 'US', '')
-- ,  ( 130 , '70 Meadow Valley Road' , '' , 'Littleton' , 'CO' , '80161', 'US', '')
-- ,  ( 131 , '328 Clemons Park' , '' , 'Warren' , 'MI' , '48092', 'US', '')
-- ,  ( 132 , '58815 Shoshone Alley' , '' , 'West Palm Beach' , 'FL' , '33405', 'US', '')
-- ,  ( 133 , '41928 Drewry Crossing' , '' , 'Charleston' , 'WV' , '25331', 'US', '')
-- ,  ( 134 , '6419 Moland Court' , '' , 'Brockton' , 'MA' , '02405', 'US', '')
-- ,  ( 135 , '0272 Butternut Center' , '' , 'Bronx' , 'NY' , '10459', 'US', '')
-- ,  ( 136 , '298 Shopko Avenue' , '' , 'Anchorage' , 'AK' , '99522', 'US', '')
-- ,  ( 137 , '9 Bay Center' , '' , 'Sioux Falls' , 'SD' , '57105', 'US', '')
-- ,  ( 138 , '4697 Welch Alley' , '' , 'Durham' , 'NC' , '27717', 'US', '')
-- ,  ( 139 , '433 Huxley Point' , '' , 'Knoxville' , 'TN' , '37924', 'US', '')
-- ,  ( 140 , '99274 Oneill Park' , '' , 'Sioux Falls' , 'SD' , '57198', 'US', '')
-- ,  ( 141 , '1196 Anderson Avenue' , '' , 'Sacramento' , 'CA' , '95833', 'US', '')
-- ,  ( 142 , '63906 Sundown Place' , '' , 'Kalamazoo' , 'MI' , '49006', 'US', '')
-- ,  ( 143 , '69 Montana Way' , '' , 'Toledo' , 'OH' , '43699', 'US', '')
-- ,  ( 144 , '7 Prairieview Drive' , '' , 'Washington' , 'DC' , '20205', 'US', '')
-- ,  ( 145 , '836 Ronald Regan Place' , '' , 'Tucson' , 'AZ' , '85754', 'US', '')
-- ,  ( 146 , '5 Emmet Court' , '' , 'Grand Forks' , 'ND' , '58207', 'US', '')
-- ,  ( 147 , '49068 Dennis Circle' , '' , 'Boston' , 'MA' , '02109', 'US', '')
-- ,  ( 148 , '1035 Goodland Alley' , '' , 'Maple Plain' , 'MN' , '55572', 'US', '')
-- ,  ( 149 , '44 Summit Point' , '' , 'Knoxville' , 'TN' , '37914', 'US', '')
-- ,  ( 150 , '2 Arrowood Lane' , '' , 'Brooklyn' , 'NY' , '11231', 'US', '')
-- ,  ( 151 , '7010 Dryden Park' , '' , 'Honolulu' , 'HI' , '96825', 'US', '')
-- ,  ( 152 , '65 Maple Trail' , '' , 'Pittsburgh' , 'PA' , '15255', 'US', '')
-- ,  ( 153 , '6 Ohio Center' , '' , 'Knoxville' , 'TN' , '37919', 'US', '')
-- ,  ( 154 , '407 Northland Court' , '' , 'Scottsdale' , 'AZ' , '85260', 'US', '')
-- ,  ( 155 , '42068 Northridge Drive' , '' , 'Miami' , 'FL' , '33169', 'US', '')
-- ,  ( 156 , '08209 Kings Way' , '' , 'Philadelphia' , 'PA' , '19160', 'US', '')
-- ,  ( 157 , '4 Grasskamp Circle' , '' , 'El Paso' , 'TX' , '79916', 'US', '')
-- ,  ( 158 , '9 Bayside Way' , '' , 'Iowa City' , 'IA' , '52245', 'US', '')
-- ,  ( 159 , '5219 Southridge Trail' , '' , 'Colorado Springs' , 'CO' , '80915', 'US', '')
-- ,  ( 160 , '3 Commercial Circle' , '' , 'San Diego' , 'CA' , '92105', 'US', '')
-- ,  ( 161 , '10217 Birchwood Avenue' , '' , 'Indianapolis' , 'IN' , '46216', 'US', '')
-- ,  ( 162 , '40900 Hazelcrest Road' , '' , 'Des Moines' , 'IA' , '50369', 'US', '')
-- ,  ( 163 , '42030 Clarendon Lane' , '' , 'Billings' , 'MT' , '59112', 'US', '')
-- ,  ( 164 , '5 Iowa Alley' , '' , 'Phoenix' , 'AZ' , '85040', 'US', '')
-- ,  ( 165 , '09172 Jenifer Street' , '' , 'Seattle' , 'WA' , '98166', 'US', '')
-- ,  ( 166 , '250 Chive Circle' , '' , 'Laurel' , 'MD' , '20709', 'US', '')
-- ,  ( 167 , '1 Packers Court' , '' , 'Northridge' , 'CA' , '91328', 'US', '')
-- ,  ( 168 , '6 Bartillon Point' , '' , 'Worcester' , 'MA' , '01610', 'US', '')
-- ,  ( 169 , '039 Sunbrook Plaza' , '' , 'Pittsburgh' , 'PA' , '15230', 'US', '')
-- ,  ( 170 , '350 Golf View Alley' , '' , 'Washington' , 'DC' , '20260', 'US', '')
-- ,  ( 171 , '6 Village Green Terrace' , '' , 'Mount Vernon' , 'NY' , '10557', 'US', '')
-- ,  ( 172 , '388 Dawn Plaza' , '' , 'Houston' , 'TX' , '77055', 'US', '')
-- ,  ( 173 , '13209 Almo Parkway' , '' , 'Panama City' , 'FL' , '32412', 'US', '')
-- ,  ( 174 , '3013 Canary Crossing' , '' , 'Houston' , 'TX' , '77090', 'US', '')
-- ,  ( 175 , '7319 Karstens Alley' , '' , 'Beaumont' , 'TX' , '77713', 'US', '')
-- ,  ( 176 , '319 Mallory Center' , '' , 'Phoenix' , 'AZ' , '85072', 'US', '')
-- ,  ( 177 , '6 Pearson Trail' , '' , 'Littleton' , 'CO' , '80126', 'US', '')
-- ,  ( 178 , '4 Commercial Trail' , '' , 'Boston' , 'MA' , '02119', 'US', '')
-- ,  ( 179 , '820 Kinsman Drive' , '' , 'Buffalo' , 'NY' , '14205', 'US', '')
-- ,  ( 180 , '4225 Jenna Place' , '' , 'Lincoln' , 'NE' , '68531', 'US', '')
-- ,  ( 181 , '5288 Oriole Circle' , '' , 'Milwaukee' , 'WI' , '53263', 'US', '')
-- ,  ( 182 , '34078 Leroy Terrace' , '' , 'Carol Stream' , 'IL' , '60351', 'US', '')
-- ,  ( 183 , '3 Rowland Terrace' , '' , 'Indianapolis' , 'IN' , '46221', 'US', '')
-- ,  ( 184 , '25 Carey Junction' , '' , 'San Diego' , 'CA' , '92191', 'US', '')
-- ,  ( 185 , '07993 Susan Circle' , '' , 'West Palm Beach' , 'FL' , '33411', 'US', '')
-- ,  ( 186 , '0 Cordelia Hill' , '' , 'Orlando' , 'FL' , '32825', 'US', '')
-- ,  ( 187 , '938 Hayes Parkway' , '' , 'San Francisco' , 'CA' , '94137', 'US', '')
-- ,  ( 188 , '65748 Sachtjen Parkway' , '' , 'New York City' , 'NY' , '10275', 'US', '')
-- ,  ( 189 , '89 Redwing Road' , '' , 'Philadelphia' , 'PA' , '19115', 'US', '')
-- ,  ( 190 , '188 Anzinger Drive' , '' , 'Gainesville' , 'GA' , '30506', 'US', '')
-- ,  ( 191 , '361 Shelley Road' , '' , 'Des Moines' , 'IA' , '50936', 'US', '')
-- ,  ( 192 , '8510 Nova Circle' , '' , 'Greenville' , 'SC' , '29610', 'US', '')
-- ,  ( 193 , '1172 Evergreen Circle' , '' , 'Olympia' , 'WA' , '98506', 'US', '')
-- ,  ( 194 , '1 Ludington Alley' , '' , 'Houston' , 'TX' , '77260', 'US', '')
-- ,  ( 195 , '2337 Rusk Drive' , '' , 'Evansville' , 'IN' , '47732', 'US', '')
-- ,  ( 196 , '6279 Brickson Park Pass' , '' , 'Staten Island' , 'NY' , '10310', 'US', '')
-- ,  ( 197 , '6400 Springs Parkway' , '' , 'Corpus Christi' , 'TX' , '78405', 'US', '')
-- ,  ( 198 , '08027 Colorado Way' , '' , 'Sandy' , 'UT' , '84093', 'US', '')
-- ,  ( 199 , '2245 Waxwing Road' , '' , 'Dallas' , 'TX' , '75397', 'US', '')
-- ,  ( 200 , '26654 Commercial Place' , '' , 'Saint Paul' , 'MN' , '55127', 'US', '')
-- ,  ( 201 , '1 Upham Street' , '' , 'Silver Spring' , 'MD' , '20904', 'US', '')
-- ,  ( 202 , '87753 Bartelt Road' , '' , 'Charlotte' , 'NC' , '28278', 'US', '')
-- ,  ( 203 , '77144 1st Alley' , '' , 'Houston' , 'TX' , '77010', 'US', '')
-- ,  ( 204 , '61053 Lillian Court' , '' , 'Little Rock' , 'AR' , '72222', 'US', '')
-- ,  ( 205 , '03527 Hanson Road' , '' , 'Lancaster' , 'PA' , '17622', 'US', '')
-- ,  ( 206 , '5 Corben Junction' , '' , 'Indianapolis' , 'IN' , '46226', 'US', '')
-- ,  ( 207 , '19340 Crowley Circle' , '' , 'Charlotte' , 'NC' , '28210', 'US', '')
-- ,  ( 208 , '8140 Sommers Street' , '' , 'Ogden' , 'UT' , '84409', 'US', '')
-- ,  ( 209 , '79 Hoffman Road' , '' , 'Fort Wayne' , 'IN' , '46825', 'US', '')
-- ,  ( 210 , '9729 Green Ridge Junction' , '' , 'Amarillo' , 'TX' , '79159', 'US', '')
-- ,  ( 211 , '37616 Fordem Place' , '' , 'Athens' , 'GA' , '30605', 'US', '')
-- ,  ( 212 , '4251 Lillian Way' , '' , 'New Castle' , 'PA' , '16107', 'US', '')
-- ,  ( 213 , '4970 Grasskamp Park' , '' , 'Greensboro' , 'NC' , '27455', 'US', '')
-- ,  ( 214 , '292 Londonderry Place' , '' , 'Arlington' , 'VA' , '22234', 'US', '')
-- ,  ( 215 , '59 Raven Terrace' , '' , 'Tallahassee' , 'FL' , '32399', 'US', '')
-- ,  ( 216 , '49634 Prentice Road' , '' , 'Newark' , 'NJ' , '07188', 'US', '')
-- ,  ( 217 , '62 Jana Court' , '' , 'Cleveland' , 'OH' , '44191', 'US', '')
-- ,  ( 218 , '30 Northridge Lane' , '' , 'Young America' , 'MN' , '55564', 'US', '')
-- ,  ( 219 , '87 Erie Circle' , '' , 'Sacramento' , 'CA' , '94263', 'US', '')
-- ,  ( 220 , '2866 Chive Hill' , '' , 'Shreveport' , 'LA' , '71161', 'US', '')
-- ,  ( 221 , '3 Dayton Terrace' , '' , 'Seattle' , 'WA' , '98104', 'US', '')
-- ,  ( 222 , '79 Del Sol Circle' , '' , 'Independence' , 'MO' , '64054', 'US', '')
-- ,  ( 223 , '0828 Goodland Court' , '' , 'Nashville' , 'TN' , '37228', 'US', '')
-- ,  ( 224 , '7 Ilene Street' , '' , 'Stamford' , 'CT' , '06922', 'US', '')
-- ,  ( 225 , '35 Fieldstone Court' , '' , 'Charlotte' , 'NC' , '28215', 'US', '')
-- ,  ( 226 , '93 Stephen Court' , '' , 'Boca Raton' , 'FL' , '33499', 'US', '')
-- ,  ( 227 , '3124 Sunbrook Lane' , '' , 'Tulsa' , 'OK' , '74103', 'US', '')
-- ,  ( 228 , '433 Hooker Avenue' , '' , 'North Hollywood' , 'CA' , '91606', 'US', '')
-- ,  ( 229 , '1103 Norway Maple Hill' , '' , 'Corpus Christi' , 'TX' , '78426', 'US', '')
-- ,  ( 230 , '5 Crowley Drive' , '' , 'Dallas' , 'TX' , '75392', 'US', '')
-- ,  ( 231 , '17940 Kipling Hill' , '' , 'Chattanooga' , 'TN' , '37405', 'US', '')
-- ,  ( 232 , '76900 International Court' , '' , 'Fresno' , 'CA' , '93726', 'US', '')
-- ,  ( 233 , '6809 Bowman Crossing' , '' , 'Washington' , 'DC' , '20051', 'US', '')
-- ,  ( 234 , '56239 Lukken Park' , '' , 'Buffalo' , 'NY' , '14276', 'US', '')
-- ,  ( 235 , '35199 Stone Corner Point' , '' , 'Hollywood' , 'FL' , '33023', 'US', '')
-- ,  ( 236 , '74993 Arkansas Park' , '' , 'Maple Plain' , 'MN' , '55572', 'US', '')
-- ,  ( 237 , '17997 Thierer Lane' , '' , 'Fort Worth' , 'TX' , '76192', 'US', '')
-- ,  ( 238 , '7 Graceland Parkway' , '' , 'Las Vegas' , 'NV' , '89150', 'US', '')
-- ,  ( 239 , '48442 Goodland Point' , '' , 'Los Angeles' , 'CA' , '90020', 'US', '')
-- ,  ( 240 , '78359 Larry Lane' , '' , 'Aiken' , 'SC' , '29805', 'US', '')
-- ,  ( 241 , '5634 Lunder Terrace' , '' , 'Ashburn' , 'VA' , '22093', 'US', '')
-- ,  ( 242 , '3 Sunnyside Circle' , '' , 'Charlotte' , 'NC' , '28230', 'US', '')
-- ,  ( 243 , '48 Summit Pass' , '' , 'Simi Valley' , 'CA' , '93094', 'US', '')
-- ,  ( 244 , '8452 Merry Drive' , '' , 'Glendale' , 'CA' , '91205', 'US', '')
-- ,  ( 245 , '6423 Trailsway Crossing' , '' , 'Colorado Springs' , 'CO' , '80945', 'US', '')
-- ,  ( 246 , '654 Nova Plaza' , '' , 'Southfield' , 'MI' , '48076', 'US', '')
-- ,  ( 247 , '4591 Barnett Park' , '' , 'Sioux Falls' , 'SD' , '57188', 'US', '')
-- ,  ( 248 , '4698 Weeping Birch Junction' , '' , 'Macon' , 'GA' , '31210', 'US', '')
-- ,  ( 249 , '38294 Browning Crossing' , '' , 'Naperville' , 'IL' , '60567', 'US', '')
-- ,  ( 250 , '4618 Northwestern Alley' , '' , 'Durham' , 'NC' , '27710', 'US', '')
-- ,  ( 251 , '96820 Dawn Alley' , '' , 'Washington' , 'DC' , '20392', 'US', '')
-- ,  ( 252 , '329 Linden Point' , '' , 'Newark' , 'DE' , '19725', 'US', '')
-- ,  ( 253 , '5458 Lotheville Parkway' , '' , 'San Diego' , 'CA' , '92153', 'US', '')
-- ,  ( 254 , '86 Rigney Trail' , '' , 'El Paso' , 'TX' , '79940', 'US', '')
-- ,  ( 255 , '4995 Riverside Park' , '' , 'Jamaica' , 'NY' , '11470', 'US', '')
-- ,  ( 256 , '11451 Crownhardt Road' , '' , 'Glendale' , 'AZ' , '85305', 'US', '')
-- ,  ( 257 , '83 Fisk Park' , '' , 'Helena' , 'MT' , '59623', 'US', '')
-- ,  ( 258 , '17630 Red Cloud Way' , '' , 'Birmingham' , 'AL' , '35242', 'US', '')
-- ,  ( 259 , '0612 Stuart Trail' , '' , 'Greensboro' , 'NC' , '27404', 'US', '')
-- ,  ( 260 , '133 Tennyson Center' , '' , 'Atlanta' , 'GA' , '30336', 'US', '')
-- ,  ( 261 , '53834 Rockefeller Circle' , '' , 'Shreveport' , 'LA' , '71115', 'US', '')
-- ,  ( 262 , '22529 Bluejay Hill' , '' , 'Riverside' , 'CA' , '92519', 'US', '')
-- ,  ( 263 , '4258 Independence Drive' , '' , 'Houston' , 'TX' , '77271', 'US', '')
-- ,  ( 264 , '73 Northridge Way' , '' , 'Milwaukee' , 'WI' , '53205', 'US', '')
-- ,  ( 265 , '7034 Morningstar Point' , '' , 'Columbus' , 'OH' , '43231', 'US', '')
-- ,  ( 266 , '3342 Shopko Pass' , '' , 'Shreveport' , 'LA' , '71161', 'US', '')
-- ,  ( 267 , '8000 Sutherland Parkway' , '' , 'Phoenix' , 'AZ' , '85067', 'US', '')
-- ,  ( 268 , '284 Vahlen Park' , '' , 'Tucson' , 'AZ' , '85743', 'US', '')
-- ,  ( 269 , '84913 Kropf Trail' , '' , 'Raleigh' , 'NC' , '27658', 'US', '')
-- ,  ( 270 , '05 Marquette Point' , '' , 'Long Beach' , 'CA' , '90840', 'US', '')
-- ,  ( 271 , '06 Larry Alley' , '' , 'Saint Petersburg' , 'FL' , '33715', 'US', '')
-- ,  ( 272 , '8 Debs Court' , '' , 'Chicago' , 'IL' , '60674', 'US', '')
-- ,  ( 273 , '34653 Fair Oaks Point' , '' , 'Grand Rapids' , 'MI' , '49510', 'US', '')
-- ,  ( 274 , '9785 Judy Circle' , '' , 'Washington' , 'DC' , '20310', 'US', '')
-- ,  ( 275 , '85 Esker Terrace' , '' , 'Tallahassee' , 'FL' , '32314', 'US', '')
-- ,  ( 276 , '045 Gale Circle' , '' , 'Lancaster' , 'PA' , '17622', 'US', '')
-- ,  ( 277 , '48154 Valley Edge Terrace' , '' , 'Hialeah' , 'FL' , '33018', 'US', '')
-- ,  ( 278 , '02799 Mcbride Terrace' , '' , 'Birmingham' , 'AL' , '35290', 'US', '')
-- ,  ( 279 , '0 Ohio Parkway' , '' , 'Boise' , 'ID' , '83722', 'US', '')
-- ,  ( 280 , '56789 Warbler Park' , '' , 'San Diego' , 'CA' , '92176', 'US', '')
-- ,  ( 281 , '4968 Pepper Wood Crossing' , '' , 'Ann Arbor' , 'MI' , '48107', 'US', '')
-- ,  ( 282 , '1620 Carey Park' , '' , 'Dayton' , 'OH' , '45490', 'US', '')
-- ,  ( 283 , '10 Bluejay Lane' , '' , 'Burbank' , 'CA' , '91520', 'US', '')
-- ,  ( 284 , '46 Amoth Plaza' , '' , 'Fort Worth' , 'TX' , '76134', 'US', '')
-- ,  ( 285 , '1718 Schmedeman Junction' , '' , 'Glendale' , 'CA' , '91210', 'US', '')
-- ,  ( 286 , '62359 Spohn Park' , '' , 'Olympia' , 'WA' , '98516', 'US', '')
-- ,  ( 287 , '0020 Pond Pass' , '' , 'Young America' , 'MN' , '55557', 'US', '')
-- ,  ( 288 , '75252 Toban Trail' , '' , 'Chicago' , 'IL' , '60663', 'US', '')
-- ,  ( 289 , '41 Bay Alley' , '' , 'Monticello' , 'MN' , '55585', 'US', '')
-- ,  ( 290 , '50362 American Ash Circle' , '' , 'Minneapolis' , 'MN' , '55446', 'US', '')
-- ,  ( 291 , '999 Kim Hill' , '' , 'Miami' , 'FL' , '33245', 'US', '')
-- ,  ( 292 , '28 Toban Crossing' , '' , 'Louisville' , 'KY' , '40233', 'US', '')
-- ,  ( 293 , '0016 Forest Terrace' , '' , 'New York City' , 'NY' , '10029', 'US', '')
-- ,  ( 294 , '390 Johnson Circle' , '' , 'Prescott' , 'AZ' , '86305', 'US', '')
-- ,  ( 295 , '80592 Lukken Place' , '' , 'Arlington' , 'VA' , '22244', 'US', '')
-- ,  ( 296 , '6 North Circle' , '' , 'Garland' , 'TX' , '75044', 'US', '')
-- ,  ( 297 , '0133 Manley Circle' , '' , 'Bloomington' , 'IN' , '47405', 'US', '')
-- ,  ( 298 , '28 Bobwhite Junction' , '' , 'Jacksonville' , 'FL' , '32259', 'US', '')
-- ,  ( 299 , '7 Kennedy Crossing' , '' , 'Houston' , 'TX' , '77010', 'US', '')
-- ,  ( 300 , '992 Express Junction' , '' , 'Louisville' , 'KY' , '40210', 'US', '')
-- ,  ( 301 , '7249 Corry Place' , '' , 'Marietta' , 'GA' , '30061', 'US', '')
-- ,  ( 302 , '8 Riverside Parkway' , '' , 'Louisville' , 'KY' , '40256', 'US', '')
-- ,  ( 303 , '43002 Ridgeway Parkway' , '' , 'Dayton' , 'OH' , '45414', 'US', '')
-- ,  ( 304 , '700 Killdeer Circle' , '' , 'El Paso' , 'TX' , '79994', 'US', '')
-- ,  ( 305 , '0060 Gale Pass' , '' , 'Amarillo' , 'TX' , '79105', 'US', '')
-- ,  ( 306 , '68 Knutson Center' , '' , 'Rochester' , 'NY' , '14614', 'US', '')
-- ,  ( 307 , '35380 Lukken Park' , '' , 'Kansas City' , 'MO' , '64187', 'US', '')
-- ,  ( 308 , '62122 Maywood Hill' , '' , 'Port Charlotte' , 'FL' , '33954', 'US', '')
-- ,  ( 309 , '4135 Columbus Crossing' , '' , 'Boston' , 'MA' , '02109', 'US', '')
-- ,  ( 310 , '779 Lakeland Court' , '' , 'Kansas City' , 'MO' , '64130', 'US', '')
-- ,  ( 311 , '9643 Maple Trail' , '' , 'Boston' , 'MA' , '02163', 'US', '')
-- ,  ( 312 , '85 Raven Street' , '' , 'Youngstown' , 'OH' , '44511', 'US', '')
-- ,  ( 313 , '846 Garrison Pass' , '' , 'Lexington' , 'KY' , '40546', 'US', '')
-- ,  ( 314 , '19 Wayridge Way' , '' , 'Salt Lake City' , 'UT' , '84152', 'US', '')
-- ,  ( 315 , '54509 Merchant Center' , '' , 'Fort Lauderdale' , 'FL' , '33325', 'US', '')
-- ,  ( 316 , '2 Mayfield Street' , '' , 'Seattle' , 'WA' , '98148', 'US', '')
-- ,  ( 317 , '68 Onsgard Center' , '' , 'Birmingham' , 'AL' , '35205', 'US', '')
-- ,  ( 318 , '720 Macpherson Plaza' , '' , 'Boston' , 'MA' , '02203', 'US', '')
-- ,  ( 319 , '79 Glacier Hill Alley' , '' , 'Lansing' , 'MI' , '48956', 'US', '')
-- ,  ( 320 , '921 Sloan Road' , '' , 'Raleigh' , 'NC' , '27610', 'US', '')
-- ,  ( 321 , '160 Elgar Center' , '' , 'Fort Wayne' , 'IN' , '46814', 'US', '')
-- ,  ( 322 , '3 Delaware Court' , '' , 'Fairbanks' , 'AK' , '99709', 'US', '')
-- ,  ( 323 , '1 Delaware Court' , '' , 'Clearwater' , 'FL' , '33763', 'US', '')
-- ,  ( 324 , '371 Summer Ridge Hill' , '' , 'Santa Barbara' , 'CA' , '93106', 'US', '')
-- ,  ( 325 , '211 Victoria Trail' , '' , 'Washington' , 'DC' , '20591', 'US', '')
-- ,  ( 326 , '843 Carey Place' , '' , 'San Francisco' , 'CA' , '94142', 'US', '')
-- ,  ( 327 , '99153 Buhler Hill' , '' , 'Los Angeles' , 'CA' , '90040', 'US', '')
-- ,  ( 328 , '27006 Armistice Crossing' , '' , 'Colorado Springs' , 'CO' , '80945', 'US', '')
-- ,  ( 329 , '570 Badeau Point' , '' , 'San Jose' , 'CA' , '95138', 'US', '')
-- ,  ( 330 , '7676 Towne Lane' , '' , 'Lubbock' , 'TX' , '79415', 'US', '')
-- ,  ( 331 , '34978 Waxwing Street' , '' , 'Sioux City' , 'IA' , '51105', 'US', '')
-- ,  ( 332 , '47 Talisman Trail' , '' , 'Atlanta' , 'GA' , '30316', 'US', '')
-- ,  ( 333 , '7130 Scofield Park' , '' , 'Winston Salem' , 'NC' , '27105', 'US', '')
-- ,  ( 334 , '226 Shelley Road' , '' , 'North Port' , 'FL' , '34290', 'US', '')
-- ,  ( 335 , '469 Erie Road' , '' , 'Cambridge' , 'MA' , '02142', 'US', '')
-- ,  ( 336 , '83 Lerdahl Point' , '' , 'Providence' , 'RI' , '02905', 'US', '')
-- ,  ( 337 , '41 Dorton Point' , '' , 'North Hollywood' , 'CA' , '91616', 'US', '')
-- ,  ( 338 , '84 Eastlawn Alley' , '' , 'Buffalo' , 'NY' , '14263', 'US', '')
-- ,  ( 339 , '116 Hanover Hill' , '' , 'Mobile' , 'AL' , '36605', 'US', '')
-- ,  ( 340 , '8 Melvin Court' , '' , 'Appleton' , 'WI' , '54915', 'US', '')
-- ,  ( 341 , '56 Trailsway Road' , '' , 'Indianapolis' , 'IN' , '46295', 'US', '')
-- ,  ( 342 , '3 Duke Place' , '' , 'Birmingham' , 'AL' , '35279', 'US', '')
-- ,  ( 343 , '4776 Reindahl Road' , '' , 'Miami' , 'FL' , '33185', 'US', '')
-- ,  ( 344 , '422 New Castle Way' , '' , 'Sacramento' , 'CA' , '95813', 'US', '')
-- ,  ( 345 , '0 Straubel Point' , '' , 'Richmond' , 'VA' , '23289', 'US', '')
-- ,  ( 346 , '3053 Sloan Court' , '' , 'Las Vegas' , 'NV' , '89166', 'US', '')
-- ,  ( 347 , '5 Barnett Court' , '' , 'Iowa City' , 'IA' , '52245', 'US', '')
-- ,  ( 348 , '47 Springview Drive' , '' , 'Colorado Springs' , 'CO' , '80920', 'US', '')
-- ,  ( 349 , '74 Esker Way' , '' , 'Washington' , 'DC' , '20073', 'US', '')
-- ,  ( 350 , '46341 1st Pass' , '' , 'Dulles' , 'VA' , '20189', 'US', '')
-- ,  ( 351 , '71 Waubesa Avenue' , '' , 'Indianapolis' , 'IN' , '46207', 'US', '')
-- ,  ( 352 , '206 Longview Place' , '' , 'Atlanta' , 'GA' , '31136', 'US', '')
-- ,  ( 353 , '741 Independence Place' , '' , 'Oklahoma City' , 'OK' , '73114', 'US', '')
-- ,  ( 354 , '336 Hintze Alley' , '' , 'Iowa City' , 'IA' , '52245', 'US', '')
-- ,  ( 355 , '665 Thackeray Way' , '' , 'Denver' , 'CO' , '80223', 'US', '')
-- ,  ( 356 , '2914 Summer Ridge Center' , '' , 'Kansas City' , 'KS' , '66112', 'US', '')
-- ,  ( 357 , '10951 Hanson Way' , '' , 'Paterson' , 'NJ' , '07505', 'US', '')
-- ,  ( 358 , '1 Express Road' , '' , 'North Port' , 'FL' , '34290', 'US', '')
-- ,  ( 359 , '018 Bellgrove Center' , '' , 'Denver' , 'CO' , '80291', 'US', '')
-- ,  ( 360 , '11 Northfield Road' , '' , 'Santa Clara' , 'CA' , '95054', 'US', '')
-- ,  ( 361 , '121 Spohn Trail' , '' , 'Minneapolis' , 'MN' , '55470', 'US', '')
-- ,  ( 362 , '11676 Algoma Circle' , '' , 'El Paso' , 'TX' , '88563', 'US', '')
-- ,  ( 363 , '3 Mosinee Plaza' , '' , 'Danbury' , 'CT' , '06816', 'US', '')
-- ,  ( 364 , '7 Crest Line Terrace' , '' , 'Trenton' , 'NJ' , '08603', 'US', '')
-- ,  ( 365 , '832 Burning Wood Crossing' , '' , 'Los Angeles' , 'CA' , '90060', 'US', '')
-- ,  ( 366 , '8975 Packers Circle' , '' , 'Columbus' , 'OH' , '43220', 'US', '')
-- ,  ( 367 , '6130 Spohn Trail' , '' , 'Chula Vista' , 'CA' , '91913', 'US', '')
-- ,  ( 368 , '787 Mosinee Street' , '' , 'Dallas' , 'TX' , '75287', 'US', '')
-- ,  ( 369 , '57165 Randy Place' , '' , 'Pasadena' , 'CA' , '91125', 'US', '')
-- ,  ( 370 , '99564 Brickson Park Crossing' , '' , 'Tacoma' , 'WA' , '98405', 'US', '')
-- ,  ( 371 , '424 Menomonie Point' , '' , 'Miami' , 'FL' , '33147', 'US', '')
-- ,  ( 372 , '66 Victoria Drive' , '' , 'Aurora' , 'CO' , '80044', 'US', '')
-- ,  ( 373 , '8927 Union Hill' , '' , 'Boston' , 'MA' , '02208', 'US', '')
-- ,  ( 374 , '25 Florence Park' , '' , 'Louisville' , 'KY' , '40266', 'US', '')
-- ,  ( 375 , '35 Ridgeway Pass' , '' , 'Wilmington' , 'DE' , '19886', 'US', '')
-- ,  ( 376 , '5378 Redwing Way' , '' , 'Stockton' , 'CA' , '95210', 'US', '')
-- ,  ( 377 , '704 Anderson Alley' , '' , 'Colorado Springs' , 'CO' , '80925', 'US', '')
-- ,  ( 378 , '883 Fordem Center' , '' , 'Louisville' , 'KY' , '40287', 'US', '')
-- ,  ( 379 , '8 Gale Road' , '' , 'Topeka' , 'KS' , '66629', 'US', '')
-- ,  ( 380 , '87737 Meadow Valley Park' , '' , 'Bryan' , 'TX' , '77806', 'US', '')
-- ,  ( 381 , '79 Lakeland Pass' , '' , 'Scranton' , 'PA' , '18514', 'US', '')
-- ,  ( 382 , '59 Canary Street' , '' , 'Seattle' , 'WA' , '98140', 'US', '')
-- ,  ( 383 , '04893 Division Road' , '' , 'Akron' , 'OH' , '44393', 'US', '')
-- ,  ( 384 , '9848 1st Junction' , '' , 'Dayton' , 'OH' , '45432', 'US', '')
-- ,  ( 385 , '65 Ronald Regan Hill' , '' , 'Corpus Christi' , 'TX' , '78415', 'US', '')
-- ,  ( 386 , '90089 Manley Street' , '' , 'Houston' , 'TX' , '77025', 'US', '')
-- ,  ( 387 , '829 Stephen Park' , '' , 'Peoria' , 'IL' , '61629', 'US', '')
-- ,  ( 388 , '3152 Delaware Place' , '' , 'El Paso' , 'TX' , '88579', 'US', '')
-- ,  ( 389 , '9291 Warner Road' , '' , 'West Palm Beach' , 'FL' , '33405', 'US', '')
-- ,  ( 390 , '97 Ronald Regan Circle' , '' , 'Washington' , 'DC' , '20436', 'US', '')
-- ,  ( 391 , '616 Eagan Park' , '' , 'Pittsburgh' , 'PA' , '15225', 'US', '')
-- ,  ( 392 , '7 Northfield Circle' , '' , 'San Diego' , 'CA' , '92170', 'US', '')
-- ,  ( 393 , '2196 Vahlen Place' , '' , 'Springfield' , 'IL' , '62776', 'US', '')
-- ,  ( 394 , '487 Graceland Lane' , '' , 'Beaumont' , 'TX' , '77713', 'US', '')
-- ,  ( 395 , '8043 Lake View Court' , '' , 'Hagerstown' , 'MD' , '21747', 'US', '')
-- ,  ( 396 , '6 Hansons Lane' , '' , 'Cincinnati' , 'OH' , '45218', 'US', '')
-- ,  ( 397 , '4 Jana Drive' , '' , 'Tucson' , 'AZ' , '85732', 'US', '')
-- ,  ( 398 , '65 Manufacturers Circle' , '' , 'Washington' , 'DC' , '20099', 'US', '')
-- ,  ( 399 , '2 Sugar Lane' , '' , 'Providence' , 'RI' , '02912', 'US', '')
-- ,  ( 400 , '7 Golf View Hill' , '' , 'Birmingham' , 'AL' , '35205', 'US', '')
-- ,  ( 401 , '92 Fair Oaks Street' , '' , 'Arlington' , 'TX' , '76096', 'US', '')
-- ,  ( 402 , '64 Anthes Court' , '' , 'Chattanooga' , 'TN' , '37416', 'US', '')
-- ,  ( 403 , '87 Green Ridge Parkway' , '' , 'Dallas' , 'TX' , '75353', 'US', '')
-- ,  ( 404 , '2 Mcbride Lane' , '' , 'Boulder' , 'CO' , '80328', 'US', '')
-- ,  ( 405 , '292 Steensland Park' , '' , 'Hamilton' , 'OH' , '45020', 'US', '')
-- ,  ( 406 , '2 Namekagon Court' , '' , 'Saint Louis' , 'MO' , '63136', 'US', '')
-- ,  ( 407 , '4696 North Place' , '' , 'Seattle' , 'WA' , '98109', 'US', '')
-- ,  ( 408 , '15800 Vahlen Trail' , '' , 'Washington' , 'DC' , '20370', 'US', '')
-- ,  ( 409 , '217 Mifflin Point' , '' , 'Largo' , 'FL' , '33777', 'US', '')
-- ,  ( 410 , '199 Karstens Drive' , '' , 'New York City' , 'NY' , '10009', 'US', '')
-- ,  ( 411 , '37 Sachs Center' , '' , 'Albany' , 'NY' , '12222', 'US', '')
-- ,  ( 412 , '6547 Lunder Court' , '' , 'Roanoke' , 'VA' , '24020', 'US', '')
-- ,  ( 413 , '7 Lotheville Road' , '' , 'Springfield' , 'IL' , '62756', 'US', '')
-- ,  ( 414 , '73 Anderson Plaza' , '' , 'Van Nuys' , 'CA' , '91411', 'US', '')
-- ,  ( 415 , '46 Pearson Alley' , '' , 'Anchorage' , 'AK' , '99512', 'US', '')
-- ,  ( 416 , '3 Packers Alley' , '' , 'Washington' , 'DC' , '20525', 'US', '')
-- ,  ( 417 , '641 Elgar Hill' , '' , 'Harrisburg' , 'PA' , '17105', 'US', '')
-- ,  ( 418 , '4157 Old Gate Road' , '' , 'Lexington' , 'KY' , '40586', 'US', '')
-- ,  ( 419 , '884 Merchant Road' , '' , 'New York City' , 'NY' , '10125', 'US', '')
-- ,  ( 420 , '1 Cody Avenue' , '' , 'Yonkers' , 'NY' , '10705', 'US', '')
-- ,  ( 421 , '1280 Hallows Drive' , '' , 'Gadsden' , 'AL' , '35905', 'US', '')
-- ,  ( 422 , '969 Hermina Way' , '' , 'Sacramento' , 'CA' , '94230', 'US', '')
-- ,  ( 423 , '70698 Graceland Park' , '' , 'Tucson' , 'AZ' , '85743', 'US', '')
-- ,  ( 424 , '82 Thierer Hill' , '' , 'Denver' , 'CO' , '80279', 'US', '')
-- ,  ( 425 , '6 Longview Point' , '' , 'Chicago' , 'IL' , '60641', 'US', '')
-- ,  ( 426 , '59 Cody Avenue' , '' , 'Wilkes Barre' , 'PA' , '18706', 'US', '')
-- ,  ( 427 , '3 Eastwood Alley' , '' , 'Maple Plain' , 'MN' , '55579', 'US', '')
-- ,  ( 428 , '18 Stephen Lane' , '' , 'Independence' , 'MO' , '64054', 'US', '')
-- ,  ( 429 , '2803 Brickson Park Terrace' , '' , 'Albany' , 'NY' , '12247', 'US', '')
-- ,  ( 430 , '4730 Loeprich Junction' , '' , 'Boston' , 'MA' , '02298', 'US', '')
-- ,  ( 431 , '20 Pankratz Way' , '' , 'Detroit' , 'MI' , '48242', 'US', '')
-- ,  ( 432 , '0475 Raven Avenue' , '' , 'Dayton' , 'OH' , '45408', 'US', '')
-- ,  ( 433 , '7 Mockingbird Way' , '' , 'Charlotte' , 'NC' , '28225', 'US', '')
-- ,  ( 434 , '84 Katie Place' , '' , 'Miami' , 'FL' , '33233', 'US', '')
-- ,  ( 435 , '3 Homewood Street' , '' , 'Tulsa' , 'OK' , '74126', 'US', '')
-- ,  ( 436 , '4 Reinke Park' , '' , 'Syracuse' , 'NY' , '13210', 'US', '')
-- ,  ( 437 , '1603 Waywood Trail' , '' , 'Charlotte' , 'NC' , '28235', 'US', '')
-- ,  ( 438 , '0392 Bluestem Parkway' , '' , 'Sterling' , 'VA' , '20167', 'US', '')
-- ,  ( 439 , '835 Dexter Parkway' , '' , 'Flint' , 'MI' , '48555', 'US', '')
-- ,  ( 440 , '42 Oriole Trail' , '' , 'Salt Lake City' , 'UT' , '84130', 'US', '')
-- ,  ( 441 , '20489 Glacier Hill Park' , '' , 'Grand Rapids' , 'MI' , '49505', 'US', '')
-- ,  ( 442 , '48 Helena Point' , '' , 'Richmond' , 'VA' , '23293', 'US', '')
-- ,  ( 443 , '1 Bluestem Pass' , '' , 'Philadelphia' , 'PA' , '19191', 'US', '')
-- ,  ( 444 , '41089 Hansons Point' , '' , 'Corpus Christi' , 'TX' , '78426', 'US', '')
-- ,  ( 445 , '262 Bobwhite Park' , '' , 'Birmingham' , 'AL' , '35290', 'US', '')
-- ,  ( 446 , '90557 Utah Avenue' , '' , 'Fort Lauderdale' , 'FL' , '33310', 'US', '')
-- ,  ( 447 , '84995 Crest Line Terrace' , '' , 'Washington' , 'DC' , '20540', 'US', '')
-- ,  ( 448 , '7243 Knutson Plaza' , '' , 'Northridge' , 'CA' , '91328', 'US', '')
-- ,  ( 449 , '6 Alpine Crossing' , '' , 'Delray Beach' , 'FL' , '33448', 'US', '')
-- ,  ( 450 , '7 Vidon Park' , '' , 'Los Angeles' , 'CA' , '90045', 'US', '')
-- ,  ( 451 , '8800 Blaine Park' , '' , 'Louisville' , 'KY' , '40250', 'US', '')
-- ,  ( 452 , '463 Blackbird Way' , '' , 'Reston' , 'VA' , '22096', 'US', '')
-- ,  ( 453 , '875 American Point' , '' , 'Knoxville' , 'TN' , '37919', 'US', '')
-- ,  ( 454 , '093 Warrior Drive' , '' , 'Pompano Beach' , 'FL' , '33069', 'US', '')
-- ,  ( 455 , '88301 2nd Crossing' , '' , 'Tyler' , 'TX' , '75799', 'US', '')
-- ,  ( 456 , '43 Karstens Trail' , '' , 'Kansas City' , 'MO' , '64190', 'US', '')
-- ,  ( 457 , '38 Mallory Terrace' , '' , 'Tucson' , 'AZ' , '85743', 'US', '')
-- ,  ( 458 , '626 Talisman Park' , '' , 'Saint Louis' , 'MO' , '63143', 'US', '')
-- ,  ( 459 , '760 Havey Park' , '' , 'Atlanta' , 'GA' , '31119', 'US', '')
-- ,  ( 460 , '7940 Kennedy Hill' , '' , 'Henderson' , 'NV' , '89074', 'US', '')
-- ,  ( 461 , '9616 1st Circle' , '' , 'Abilene' , 'TX' , '79699', 'US', '')
-- ,  ( 462 , '4 Nevada Circle' , '' , 'Amarillo' , 'TX' , '79116', 'US', '')
-- ,  ( 463 , '2 Oak Hill' , '' , 'New Haven' , 'CT' , '06533', 'US', '')
-- ,  ( 464 , '58418 Erie Way' , '' , 'Miami' , 'FL' , '33175', 'US', '')
-- ,  ( 465 , '852 Portage Junction' , '' , 'Charleston' , 'WV' , '25305', 'US', '')
-- ,  ( 466 , '7799 Sycamore Center' , '' , 'Brooklyn' , 'NY' , '11231', 'US', '')
-- ,  ( 467 , '40 Surrey Point' , '' , 'Cincinnati' , 'OH' , '45296', 'US', '')
-- ,  ( 468 , '7441 Larry Crossing' , '' , 'Miami' , 'FL' , '33134', 'US', '')
-- ,  ( 469 , '25 Larry Hill' , '' , 'Dallas' , 'TX' , '75358', 'US', '')
-- ,  ( 470 , '4164 Village Way' , '' , 'Flint' , 'MI' , '48550', 'US', '')
-- ,  ( 471 , '93 Washington Alley' , '' , 'Richmond' , 'VA' , '23237', 'US', '')
-- ,  ( 472 , '810 Granby Trail' , '' , 'Nashville' , 'TN' , '37245', 'US', '')
-- ,  ( 473 , '322 Brentwood Drive' , '' , 'Washington' , 'DC' , '20535', 'US', '')
-- ,  ( 474 , '956 Packers Circle' , '' , 'Spokane' , 'WA' , '99210', 'US', '')
-- ,  ( 475 , '0 Nelson Lane' , '' , 'Little Rock' , 'AR' , '72215', 'US', '')
-- ,  ( 476 , '0 Lighthouse Bay Road' , '' , 'Providence' , 'RI' , '02912', 'US', '')
-- ,  ( 477 , '3 Maryland Court' , '' , 'Nashville' , 'TN' , '37210', 'US', '')
-- ,  ( 478 , '6 Fallview Lane' , '' , 'Brooklyn' , 'NY' , '11231', 'US', '')
-- ,  ( 479 , '01 Becker Plaza' , '' , 'Tucson' , 'AZ' , '85754', 'US', '')
-- ,  ( 480 , '75 Express Trail' , '' , 'Washington' , 'DC' , '20078', 'US', '')
-- ,  ( 481 , '619 Colorado Way' , '' , 'Springfield' , 'MO' , '65898', 'US', '')
-- ,  ( 482 , '992 Nobel Lane' , '' , 'Norwalk' , 'CT' , '06854', 'US', '')
-- ,  ( 483 , '72445 Homewood Way' , '' , 'San Jose' , 'CA' , '95113', 'US', '')
-- ,  ( 484 , '42535 Sundown Street' , '' , 'Columbia' , 'SC' , '29208', 'US', '')
-- ,  ( 485 , '16 Manitowish Center' , '' , 'Jamaica' , 'NY' , '11447', 'US', '')
-- ,  ( 486 , '527 Buell Street' , '' , 'Orlando' , 'FL' , '32885', 'US', '')
-- ,  ( 487 , '25 Superior Court' , '' , 'Scottsdale' , 'AZ' , '85260', 'US', '')
-- ,  ( 488 , '117 Michigan Junction' , '' , 'San Francisco' , 'CA' , '94137', 'US', '')
-- ,  ( 489 , '50 Fuller Avenue' , '' , 'Salt Lake City' , 'UT' , '84130', 'US', '')
-- ,  ( 490 , '40165 Muir Parkway' , '' , 'New York City' , 'NY' , '10110', 'US', '')
-- ,  ( 491 , '14160 Hudson Terrace' , '' , 'Fort Wayne' , 'IN' , '46852', 'US', '')
-- ,  ( 492 , '86 Manley Crossing' , '' , 'Houston' , 'TX' , '77005', 'US', '')
-- ,  ( 493 , '838 Sutteridge Avenue' , '' , 'Jacksonville' , 'FL' , '32209', 'US', '')
-- ,  ( 494 , '09624 Dunning Way' , '' , 'Memphis' , 'TN' , '38197', 'US', '')
-- ,  ( 495 , '7 Leroy Lane' , '' , 'Bloomington' , 'IL' , '61709', 'US', '')
-- ,  ( 496 , '84629 Dunning Terrace' , '' , 'Washington' , 'DC' , '20551', 'US', '')
-- ,  ( 497 , '53904 Sheridan Terrace' , '' , 'Oklahoma City' , 'OK' , '73129', 'US', '')
-- ,  ( 498 , '3 Shoshone Crossing' , '' , 'Flushing' , 'NY' , '11355', 'US', '')
-- ,  ( 499 , '9995 Paget Center' , '' , 'South Lake Tahoe' , 'CA' , '96154', 'US', '')
-- ,  ( 500 , '7832 Thackeray Alley' , '' , 'Arlington' , 'VA' , '22225', 'US', '')
-- ,  ( 501 , '5 Pierstorff Point' , '' , 'Indianapolis' , 'IN' , '46278', 'US', '')
-- ,  ( 502 , '4 Dexter Crossing' , '' , 'Duluth' , 'GA' , '30195', 'US', '')
-- ,  ( 503 , '75 Blackbird Junction' , '' , 'Des Moines' , 'IA' , '50369', 'US', '')
-- ,  ( 504 , '4244 Vidon Parkway' , '' , 'Youngstown' , 'OH' , '44511', 'US', '')
-- ,  ( 505 , '3 Clyde Gallagher Way' , '' , 'Naples' , 'FL' , '34108', 'US', '')
-- ,  ( 506 , '4474 Bay Center' , '' , 'Atlanta' , 'GA' , '31190', 'US', '')
-- ,  ( 507 , '893 New Castle Lane' , '' , 'Philadelphia' , 'PA' , '19093', 'US', '')
-- ,  ( 508 , '3 Dennis Point' , '' , 'Los Angeles' , 'CA' , '90060', 'US', '')
-- ,  ( 509 , '99 Scoville Drive' , '' , 'Tampa' , 'FL' , '33694', 'US', '')
-- ,  ( 510 , '2 Myrtle Junction' , '' , 'Washington' , 'DC' , '20580', 'US', '')
-- ,  ( 511 , '8465 Garrison Way' , '' , 'East Saint Louis' , 'IL' , '62205', 'US', '')
-- ,  ( 512 , '272 Cambridge Plaza' , '' , 'Columbia' , 'SC' , '29215', 'US', '')
-- ,  ( 513 , '9648 Arrowood Avenue' , '' , 'Green Bay' , 'WI' , '54313', 'US', '')
-- ,  ( 514 , '05 Longview Point' , '' , 'Boston' , 'MA' , '02109', 'US', '')
-- ,  ( 515 , '240 Prentice Alley' , '' , 'Frederick' , 'MD' , '21705', 'US', '')
-- ,  ( 516 , '731 Kennedy Crossing' , '' , 'Portsmouth' , 'NH' , '00214', 'US', '')
-- ,  ( 517 , '3007 Mayer Plaza' , '' , 'Houston' , 'TX' , '77260', 'US', '')
-- ,  ( 518 , '88 Milwaukee Park' , '' , 'Waltham' , 'MA' , '02453', 'US', '')
-- ,  ( 519 , '17 Heffernan Plaza' , '' , 'Fort Worth' , 'TX' , '76198', 'US', '')
-- ,  ( 520 , '954 Hauk Road' , '' , 'San Francisco' , 'CA' , '94154', 'US', '')
-- ,  ( 521 , '41501 Emmet Junction' , '' , 'San Antonio' , 'TX' , '78225', 'US', '')
-- ,  ( 522 , '64 Artisan Plaza' , '' , 'Boise' , 'ID' , '83705', 'US', '')
-- ,  ( 523 , '69826 Carey Avenue' , '' , 'Los Angeles' , 'CA' , '90081', 'US', '')
-- ,  ( 524 , '42754 Pawling Drive' , '' , 'Arlington' , 'TX' , '76096', 'US', '')
-- ,  ( 525 , '7156 4th Circle' , '' , 'Jersey City' , 'NJ' , '07305', 'US', '')
-- ,  ( 526 , '7 Burning Wood Drive' , '' , 'Fairfield' , 'CT' , '06825', 'US', '')
-- ,  ( 527 , '4 Summerview Way' , '' , 'Melbourne' , 'FL' , '32941', 'US', '')
-- ,  ( 528 , '5 Nova Center' , '' , 'Columbia' , 'MO' , '65211', 'US', '')
-- ,  ( 529 , '3032 Kropf Trail' , '' , 'Flint' , 'MI' , '48505', 'US', '')
-- ,  ( 530 , '6 Moland Center' , '' , 'Albuquerque' , 'NM' , '87105', 'US', '')
-- ,  ( 531 , '3 Oriole Junction' , '' , 'San Antonio' , 'TX' , '78291', 'US', '')
-- ,  ( 532 , '69594 Northview Junction' , '' , 'Gainesville' , 'FL' , '32610', 'US', '')
-- ,  ( 533 , '8146 South Pass' , '' , 'Bellevue' , 'WA' , '98008', 'US', '')
-- ,  ( 534 , '37931 Dottie Alley' , '' , 'Huntington' , 'WV' , '25705', 'US', '')
-- ,  ( 535 , '9 2nd Avenue' , '' , 'San Jose' , 'CA' , '95133', 'US', '')
-- ,  ( 536 , '2248 Daystar Terrace' , '' , 'Young America' , 'MN' , '55573', 'US', '')
-- ,  ( 537 , '3906 Clarendon Court' , '' , 'Phoenix' , 'AZ' , '85030', 'US', '')
-- ,  ( 538 , '019 Bartillon Crossing' , '' , 'Huntington' , 'WV' , '25705', 'US', '')
-- ,  ( 539 , '70839 Hoepker Lane' , '' , 'Lincoln' , 'NE' , '68505', 'US', '')
-- ,  ( 540 , '1569 Schurz Pass' , '' , 'Los Angeles' , 'CA' , '90081', 'US', '')
-- ,  ( 541 , '24 Corry Junction' , '' , 'Nashville' , 'TN' , '37235', 'US', '')
-- ,  ( 542 , '58652 Blackbird Avenue' , '' , 'Washington' , 'DC' , '20215', 'US', '')
-- ,  ( 543 , '50578 Wayridge Alley' , '' , 'Amarillo' , 'TX' , '79116', 'US', '')
-- ,  ( 544 , '7922 Little Fleur Drive' , '' , 'Carlsbad' , 'CA' , '92013', 'US', '')
-- ,  ( 545 , '8 Hudson Place' , '' , 'Cincinnati' , 'OH' , '45271', 'US', '')
-- ,  ( 546 , '556 New Castle Center' , '' , 'Saint Louis' , 'MO' , '63116', 'US', '')
-- ,  ( 547 , '7762 Carey Lane' , '' , 'San Francisco' , 'CA' , '94137', 'US', '')
-- ,  ( 548 , '37989 Manitowish Circle' , '' , 'Norfolk' , 'VA' , '23509', 'US', '')
-- ,  ( 549 , '266 Jenifer Circle' , '' , 'Daytona Beach' , 'FL' , '32123', 'US', '')
-- ,  ( 550 , '19018 Sachtjen Center' , '' , 'Loretto' , 'MN' , '55598', 'US', '')
-- ,  ( 551 , '666 Ridge Oak Alley' , '' , 'Philadelphia' , 'PA' , '19172', 'US', '')
-- ,  ( 552 , '028 Waxwing Point' , '' , 'Silver Spring' , 'MD' , '20910', 'US', '')
-- ,  ( 553 , '8 Buhler Trail' , '' , 'Akron' , 'OH' , '44393', 'US', '')
-- ,  ( 554 , '18921 Tomscot Avenue' , '' , 'Baltimore' , 'MD' , '21229', 'US', '')
-- ,  ( 555 , '7200 Thompson Parkway' , '' , 'Elmira' , 'NY' , '14905', 'US', '')
-- ,  ( 556 , '220 Forest Dale Center' , '' , 'Green Bay' , 'WI' , '54313', 'US', '')
-- ,  ( 557 , '8166 Ryan Street' , '' , 'Pasadena' , 'CA' , '91109', 'US', '')
-- ,  ( 558 , '0 Nobel Drive' , '' , 'Tucson' , 'AZ' , '85732', 'US', '')
-- ,  ( 559 , '2107 Sheridan Crossing' , '' , 'Houston' , 'TX' , '77212', 'US', '')
-- ,  ( 560 , '688 Monument Trail' , '' , 'Colorado Springs' , 'CO' , '80925', 'US', '')
-- ,  ( 561 , '90415 Marquette Court' , '' , 'Detroit' , 'MI' , '48224', 'US', '')
-- ,  ( 562 , '77 Sloan Plaza' , '' , 'Grand Rapids' , 'MI' , '49510', 'US', '')
-- ,  ( 563 , '9 Schiller Crossing' , '' , 'Fort Collins' , 'CO' , '80525', 'US', '')
-- ,  ( 564 , '60 Quincy Alley' , '' , 'Frederick' , 'MD' , '21705', 'US', '')
-- ,  ( 565 , '1 Ruskin Point' , '' , 'San Antonio' , 'TX' , '78260', 'US', '')
-- ,  ( 566 , '804 Briar Crest Parkway' , '' , 'Fresno' , 'CA' , '93721', 'US', '')
-- ,  ( 567 , '506 Weeping Birch Parkway' , '' , 'Greensboro' , 'NC' , '27499', 'US', '')
-- ,  ( 568 , '585 Homewood Terrace' , '' , 'New York City' , 'NY' , '10090', 'US', '')
-- ,  ( 569 , '687 Butternut Road' , '' , 'Houston' , 'TX' , '77040', 'US', '')
-- ,  ( 570 , '64 Norway Maple Parkway' , '' , 'Redwood City' , 'CA' , '94064', 'US', '')
-- ,  ( 571 , '7 Lunder Park' , '' , 'Tuscaloosa' , 'AL' , '35405', 'US', '')
-- ,  ( 572 , '76 Warbler Junction' , '' , 'Fresno' , 'CA' , '93762', 'US', '')
-- ,  ( 573 , '0 Forster Trail' , '' , 'Houston' , 'TX' , '77293', 'US', '')
-- ,  ( 574 , '41286 Marcy Park' , '' , 'North Las Vegas' , 'NV' , '89036', 'US', '')
-- ,  ( 575 , '4 Johnson Plaza' , '' , 'Columbus' , 'OH' , '43268', 'US', '')
-- ,  ( 576 , '502 Monterey Street' , '' , 'Winston Salem' , 'NC' , '27157', 'US', '')
-- ,  ( 577 , '0 Menomonie Circle' , '' , 'Dayton' , 'OH' , '45426', 'US', '')
-- ,  ( 578 , '9960 Reindahl Lane' , '' , 'Houston' , 'TX' , '77080', 'US', '')
-- ,  ( 579 , '5 Canary Point' , '' , 'Arlington' , 'TX' , '76004', 'US', '')
-- ,  ( 580 , '00066 Mendota Road' , '' , 'Wilmington' , 'NC' , '28410', 'US', '')
-- ,  ( 581 , '50 Bayside Pass' , '' , 'Brockton' , 'MA' , '02405', 'US', '')
-- ,  ( 582 , '17759 Dayton Street' , '' , 'Baltimore' , 'MD' , '21290', 'US', '')
-- ,  ( 583 , '606 Arapahoe Place' , '' , 'Jacksonville' , 'FL' , '32255', 'US', '')
-- ,  ( 584 , '4282 Sutteridge Way' , '' , 'Philadelphia' , 'PA' , '19125', 'US', '')
-- ,  ( 585 , '2 7th Trail' , '' , 'Dallas' , 'TX' , '75241', 'US', '')
-- ,  ( 586 , '712 Buena Vista Pass' , '' , 'North Las Vegas' , 'NV' , '89087', 'US', '')
-- ,  ( 587 , '5 Prentice Street' , '' , 'New York City' , 'NY' , '10034', 'US', '')
-- ,  ( 588 , '3942 Melody Road' , '' , 'Beaufort' , 'SC' , '29905', 'US', '')
-- ,  ( 589 , '67 Shelley Court' , '' , 'Whittier' , 'CA' , '90610', 'US', '')
-- ,  ( 590 , '329 Corben Alley' , '' , 'Boca Raton' , 'FL' , '33499', 'US', '')
-- ,  ( 591 , '4010 Truax Parkway' , '' , 'Pueblo' , 'CO' , '81015', 'US', '')
-- ,  ( 592 , '28947 Pearson Way' , '' , 'Bismarck' , 'ND' , '58505', 'US', '')
-- ,  ( 593 , '43124 Di Loreto Court' , '' , 'Los Angeles' , 'CA' , '90010', 'US', '')
-- ,  ( 594 , '58780 Blackbird Point' , '' , 'New York City' , 'NY' , '10045', 'US', '')
-- ,  ( 595 , '104 Vidon Hill' , '' , 'Spring' , 'TX' , '77386', 'US', '')
-- ,  ( 596 , '307 Anniversary Junction' , '' , 'Wichita' , 'KS' , '67220', 'US', '')
-- ,  ( 597 , '9080 Doe Crossing Place' , '' , 'Toledo' , 'OH' , '43605', 'US', '')
-- ,  ( 598 , '2 Cordelia Place' , '' , 'Omaha' , 'NE' , '68179', 'US', '')
-- ,  ( 599 , '23340 Meadow Valley Pass' , '' , 'Ridgely' , 'MD' , '21684', 'US', '')
-- ,  ( 600 , '2829 Erie Court' , '' , 'Huntington' , 'WV' , '25709', 'US', '')
-- ,  ( 601 , '5 Reinke Way' , '' , 'Oklahoma City' , 'OK' , '73190', 'US', '')
-- ,  ( 602 , '3798 Crownhardt Lane' , '' , 'Washington' , 'DC' , '20425', 'US', '')
-- ,  ( 603 , '77 Porter Pass' , '' , 'Winston Salem' , 'NC' , '27105', 'US', '')
-- ,  ( 604 , '219 Gulseth Terrace' , '' , 'Washington' , 'DC' , '20557', 'US', '')
-- ,  ( 605 , '764 Packers Alley' , '' , 'Salinas' , 'CA' , '93907', 'US', '')
-- ,  ( 606 , '6 Delaware Road' , '' , 'Sunnyvale' , 'CA' , '94089', 'US', '')
-- ,  ( 607 , '506 Anhalt Place' , '' , 'Inglewood' , 'CA' , '90310', 'US', '')
-- ,  ( 608 , '32 Cody Center' , '' , 'Charlotte' , 'NC' , '28247', 'US', '')
-- ,  ( 609 , '62457 Veith Road' , '' , 'Dallas' , 'TX' , '75392', 'US', '')
-- ,  ( 610 , '28 Manitowish Park' , '' , 'Macon' , 'GA' , '31217', 'US', '')
-- ,  ( 611 , '965 Harper Center' , '' , 'Orange' , 'CA' , '92668', 'US', '')
-- ,  ( 612 , '45810 West Trail' , '' , 'Houston' , 'TX' , '77276', 'US', '')
-- ,  ( 613 , '50288 Scott Way' , '' , 'Colorado Springs' , 'CO' , '80940', 'US', '')
-- ,  ( 614 , '6 Texas Road' , '' , 'Sacramento' , 'CA' , '95838', 'US', '')
-- ,  ( 615 , '9 Arizona Circle' , '' , 'Dallas' , 'TX' , '75353', 'US', '')
-- ,  ( 616 , '6 Lighthouse Bay Court' , '' , 'Lake Worth' , 'FL' , '33462', 'US', '')
-- ,  ( 617 , '5 Arrowood Hill' , '' , 'Atlanta' , 'GA' , '30392', 'US', '')
-- ,  ( 618 , '00 Coolidge Way' , '' , 'Bakersfield' , 'CA' , '93381', 'US', '')
-- ,  ( 619 , '420 Surrey Court' , '' , 'Washington' , 'DC' , '20226', 'US', '')
-- ,  ( 620 , '880 Harper Alley' , '' , 'Miami' , 'FL' , '33180', 'US', '')
-- ,  ( 621 , '9 5th Alley' , '' , 'Tulsa' , 'OK' , '74133', 'US', '')
-- ,  ( 622 , '75939 Thackeray Avenue' , '' , 'Lexington' , 'KY' , '40596', 'US', '')
-- ,  ( 623 , '2018 Bashford Circle' , '' , 'Augusta' , 'GA' , '30911', 'US', '')
-- ,  ( 624 , '9679 Morning Trail' , '' , 'Columbus' , 'OH' , '43240', 'US', '')
-- ,  ( 625 , '4807 Homewood Junction' , '' , 'New York City' , 'NY' , '10184', 'US', '')
-- ,  ( 626 , '4 New Castle Plaza' , '' , 'Richmond' , 'VA' , '23293', 'US', '')
-- ,  ( 627 , '9 Green Circle' , '' , 'Erie' , 'PA' , '16534', 'US', '')
-- ,  ( 628 , '749 John Wall Street' , '' , 'Jackson' , 'MS' , '39204', 'US', '')
-- ,  ( 629 , '5 Blue Bill Park Crossing' , '' , 'San Jose' , 'CA' , '95194', 'US', '')
-- ,  ( 630 , '029 Bartelt Circle' , '' , 'Jacksonville' , 'FL' , '32204', 'US', '')
-- ,  ( 631 , '904 Haas Road' , '' , 'Jacksonville' , 'FL' , '32236', 'US', '')
-- ,  ( 632 , '997 Starling Court' , '' , 'Lancaster' , 'PA' , '17605', 'US', '')
-- ,  ( 633 , '443 Namekagon Circle' , '' , 'Louisville' , 'KY' , '40210', 'US', '')
-- ,  ( 634 , '7 Monument Terrace' , '' , 'Alexandria' , 'VA' , '22301', 'US', '')
-- ,  ( 635 , '8 Linden Circle' , '' , 'Kansas City' , 'MO' , '64101', 'US', '')
-- ,  ( 636 , '32991 Bonner Alley' , '' , 'Visalia' , 'CA' , '93291', 'US', '')
-- ,  ( 637 , '59 Bartillon Parkway' , '' , 'Phoenix' , 'AZ' , '85053', 'US', '')
-- ,  ( 638 , '5 Chinook Trail' , '' , 'Syracuse' , 'NY' , '13217', 'US', '')
-- ,  ( 639 , '8 Veith Road' , '' , 'Newton' , 'MA' , '02458', 'US', '')
-- ,  ( 640 , '9 Sachs Road' , '' , 'Manchester' , 'NH' , '03105', 'US', '')
-- ,  ( 641 , '17 Moose Avenue' , '' , 'Largo' , 'FL' , '34643', 'US', '')
-- ,  ( 642 , '58913 Myrtle Court' , '' , 'Des Moines' , 'IA' , '50315', 'US', '')
-- ,  ( 643 , '3 Ramsey Crossing' , '' , 'Memphis' , 'TN' , '38104', 'US', '')
-- ,  ( 644 , '359 Shelley Drive' , '' , 'Washington' , 'DC' , '20430', 'US', '')
-- ,  ( 645 , '94 Dapin Road' , '' , 'Cleveland' , 'OH' , '44191', 'US', '')
-- ,  ( 646 , '76 Forest Dale Place' , '' , 'Roanoke' , 'VA' , '24034', 'US', '')
-- ,  ( 647 , '33533 Mariners Cove Court' , '' , 'Canton' , 'OH' , '44710', 'US', '')
-- ,  ( 648 , '2107 Thompson Junction' , '' , 'South Bend' , 'IN' , '46699', 'US', '')
-- ,  ( 649 , '1 Kenwood Center' , '' , 'Chicago' , 'IL' , '60686', 'US', '')
-- ,  ( 650 , '98 Del Sol Court' , '' , 'Boca Raton' , 'FL' , '33487', 'US', '')
-- ,  ( 651 , '80 Westridge Lane' , '' , 'Pompano Beach' , 'FL' , '33069', 'US', '')
-- ,  ( 652 , '722 Marquette Drive' , '' , 'Honolulu' , 'HI' , '96835', 'US', '')
-- ,  ( 653 , '72 Chinook Lane' , '' , 'Los Angeles' , 'CA' , '90010', 'US', '')
-- ,  ( 654 , '1 Pine View Alley' , '' , 'Fairfield' , 'CT' , '06825', 'US', '')
-- ,  ( 655 , '8010 Michigan Lane' , '' , 'Boca Raton' , 'FL' , '33432', 'US', '')
-- ,  ( 656 , '6330 Doe Crossing Trail' , '' , 'Atlanta' , 'GA' , '30356', 'US', '')
-- ,  ( 657 , '63 Quincy Circle' , '' , 'Tulsa' , 'OK' , '74193', 'US', '')
-- ,  ( 658 , '4 Farragut Junction' , '' , 'East Saint Louis' , 'IL' , '62205', 'US', '')
-- ,  ( 659 , '92509 Crest Line Terrace' , '' , 'Sioux City' , 'IA' , '51110', 'US', '')
-- ,  ( 660 , '6185 Golf Pass' , '' , 'Pensacola' , 'FL' , '32505', 'US', '')
-- ,  ( 661 , '4185 Sutteridge Park' , '' , 'Phoenix' , 'AZ' , '85053', 'US', '')
-- ,  ( 662 , '779 Annamark Alley' , '' , 'Saint Louis' , 'MO' , '63196', 'US', '')
-- ,  ( 663 , '52727 Grasskamp Road' , '' , 'Anderson' , 'IN' , '46015', 'US', '')
-- ,  ( 664 , '626 Golden Leaf Court' , '' , 'Salem' , 'OR' , '97312', 'US', '')
-- ,  ( 665 , '8 Buell Junction' , '' , 'Saint Louis' , 'MO' , '63196', 'US', '')
-- ,  ( 666 , '39098 Spenser Parkway' , '' , 'Orlando' , 'FL' , '32803', 'US', '')
-- ,  ( 667 , '37 Manley Lane' , '' , 'Frederick' , 'MD' , '21705', 'US', '')
-- ,  ( 668 , '6 Loeprich Parkway' , '' , 'Aiken' , 'SC' , '29805', 'US', '')
-- ,  ( 669 , '7 Hallows Trail' , '' , 'Toledo' , 'OH' , '43615', 'US', '')
-- ,  ( 670 , '40 Ridgeview Junction' , '' , 'Syracuse' , 'NY' , '13224', 'US', '')
-- ,  ( 671 , '1228 Morning Drive' , '' , 'Minneapolis' , 'MN' , '55412', 'US', '')
-- ,  ( 672 , '412 Cardinal Alley' , '' , 'Wichita' , 'KS' , '67215', 'US', '')
-- ,  ( 673 , '563 Clove Drive' , '' , 'Des Moines' , 'IA' , '50320', 'US', '')
-- ,  ( 674 , '6 Roth Place' , '' , 'North Port' , 'FL' , '34290', 'US', '')
-- ,  ( 675 , '93 Sunbrook Point' , '' , 'Birmingham' , 'AL' , '35231', 'US', '')
-- ,  ( 676 , '7 Walton Drive' , '' , 'Palmdale' , 'CA' , '93591', 'US', '')
-- ,  ( 677 , '91 Memorial Hill' , '' , 'Jefferson City' , 'MO' , '65110', 'US', '')
-- ,  ( 678 , '06 Park Meadow Circle' , '' , 'Saint Joseph' , 'MO' , '64504', 'US', '')
-- ,  ( 679 , '29281 Canary Place' , '' , 'Louisville' , 'KY' , '40287', 'US', '')
-- ,  ( 680 , '353 Butternut Avenue' , '' , 'Portland' , 'OR' , '97221', 'US', '')
-- ,  ( 681 , '7 Weeping Birch Hill' , '' , 'Boca Raton' , 'FL' , '33432', 'US', '')
-- ,  ( 682 , '92 Gale Court' , '' , 'Washington' , 'DC' , '20078', 'US', '')
-- ,  ( 683 , '96549 Fieldstone Trail' , '' , 'South Lake Tahoe' , 'CA' , '96154', 'US', '')
-- ,  ( 684 , '43045 Fieldstone Court' , '' , 'San Antonio' , 'TX' , '78291', 'US', '')
-- ,  ( 685 , '6588 Mayer Road' , '' , 'Naples' , 'FL' , '34108', 'US', '')
-- ,  ( 686 , '0695 Continental Street' , '' , 'Indianapolis' , 'IN' , '46239', 'US', '')
-- ,  ( 687 , '17 Mockingbird Trail' , '' , 'Tucson' , 'AZ' , '85732', 'US', '')
-- ,  ( 688 , '2968 Truax Junction' , '' , 'Garland' , 'TX' , '75044', 'US', '')
-- ,  ( 689 , '7859 Weeping Birch Parkway' , '' , 'South Lake Tahoe' , 'CA' , '96154', 'US', '')
-- ,  ( 690 , '2 Anzinger Lane' , '' , 'Amarillo' , 'TX' , '79171', 'US', '')
-- ,  ( 691 , '1 Coolidge Pass' , '' , 'Santa Barbara' , 'CA' , '93150', 'US', '')
-- ,  ( 692 , '26724 Forest Run Center' , '' , 'Saint Paul' , 'MN' , '55166', 'US', '')
-- ,  ( 693 , '82794 Valley Edge Crossing' , '' , 'Pinellas Park' , 'FL' , '34665', 'US', '')
-- ,  ( 694 , '380 Brown Lane' , '' , 'Montgomery' , 'AL' , '36109', 'US', '')
-- ,  ( 695 , '1 Kingsford Place' , '' , 'Lake Charles' , 'LA' , '70616', 'US', '')
-- ,  ( 696 , '719 Monica Circle' , '' , 'Nashville' , 'TN' , '37245', 'US', '')
-- ,  ( 697 , '17485 Di Loreto Trail' , '' , 'Washington' , 'DC' , '20575', 'US', '')
-- ,  ( 698 , '0251 Atwood Hill' , '' , 'Madison' , 'WI' , '53726', 'US', '')
-- ,  ( 699 , '0 West Plaza' , '' , 'Fort Wayne' , 'IN' , '46805', 'US', '')
-- ,  ( 700 , '27543 Dryden Crossing' , '' , 'West Palm Beach' , 'FL' , '33421', 'US', '')
-- ,  ( 701 , '0 Dawn Parkway' , '' , 'Detroit' , 'MI' , '48258', 'US', '')
-- ,  ( 702 , '30580 Brickson Park Place' , '' , 'Washington' , 'DC' , '20057', 'US', '')
-- ,  ( 703 , '994 Mosinee Circle' , '' , 'Oklahoma City' , 'OK' , '73197', 'US', '')
-- ,  ( 704 , '3326 Shoshone Center' , '' , 'Austin' , 'TX' , '78749', 'US', '')
-- ,  ( 705 , '77928 Oak Place' , '' , 'Des Moines' , 'IA' , '50320', 'US', '')
-- ,  ( 706 , '39533 1st Street' , '' , 'San Jose' , 'CA' , '95108', 'US', '')
-- ,  ( 707 , '34 Lakeland Plaza' , '' , 'Portland' , 'OR' , '97201', 'US', '')
-- ,  ( 708 , '19509 Delaware Terrace' , '' , 'Los Angeles' , 'CA' , '90010', 'US', '')
-- ,  ( 709 , '82 Clyde Gallagher Junction' , '' , 'Green Bay' , 'WI' , '54305', 'US', '')
-- ,  ( 710 , '43259 Doe Crossing Place' , '' , 'Houston' , 'TX' , '77201', 'US', '')
-- ,  ( 711 , '135 2nd Crossing' , '' , 'Littleton' , 'CO' , '80126', 'US', '')
-- ,  ( 712 , '2256 Fairfield Alley' , '' , 'Mesa' , 'AZ' , '85210', 'US', '')
-- ,  ( 713 , '9 Menomonie Street' , '' , 'Tampa' , 'FL' , '33605', 'US', '')
-- ,  ( 714 , '417 Eliot Way' , '' , 'Wilmington' , 'DE' , '19810', 'US', '')
-- ,  ( 715 , '192 Fuller Junction' , '' , 'Lexington' , 'KY' , '40581', 'US', '')
-- ,  ( 716 , '8613 Chinook Point' , '' , 'Bonita Springs' , 'FL' , '34135', 'US', '')
-- ,  ( 717 , '9 Kropf Road' , '' , 'Salt Lake City' , 'UT' , '84125', 'US', '')
-- ,  ( 718 , '84959 Leroy Terrace' , '' , 'Portland' , 'OR' , '97221', 'US', '')
-- ,  ( 719 , '81 Straubel Trail' , '' , 'Augusta' , 'GA' , '30919', 'US', '')
-- ,  ( 720 , '10 Homewood Point' , '' , 'Valdosta' , 'GA' , '31605', 'US', '')
-- ,  ( 721 , '6648 Dryden Point' , '' , 'North Las Vegas' , 'NV' , '89087', 'US', '')
-- ,  ( 722 , '3 Rigney Road' , '' , 'Chicago' , 'IL' , '60681', 'US', '')
-- ,  ( 723 , '0 Corry Park' , '' , 'Atlanta' , 'GA' , '30392', 'US', '')
-- ,  ( 724 , '5827 Warrior Park' , '' , 'San Diego' , 'CA' , '92121', 'US', '')
-- ,  ( 725 , '97 Bultman Court' , '' , 'Grand Rapids' , 'MI' , '49544', 'US', '')
-- ,  ( 726 , '1 Macpherson Parkway' , '' , 'Tallahassee' , 'FL' , '32314', 'US', '')
-- ,  ( 727 , '731 Ludington Street' , '' , 'Sacramento' , 'CA' , '94297', 'US', '')
-- ,  ( 728 , '588 Sutherland Lane' , '' , 'Beaumont' , 'TX' , '77713', 'US', '')
-- ,  ( 729 , '392 Clemons Street' , '' , 'Glendale' , 'AZ' , '85305', 'US', '')
-- ,  ( 730 , '48 Farmco Avenue' , '' , 'Bakersfield' , 'CA' , '93381', 'US', '')
-- ,  ( 731 , '4530 Russell Junction' , '' , 'Inglewood' , 'CA' , '90310', 'US', '')
-- ,  ( 732 , '59 Carioca Park' , '' , 'San Jose' , 'CA' , '95113', 'US', '')
-- ,  ( 733 , '35 Larry Park' , '' , 'Mobile' , 'AL' , '36610', 'US', '')
-- ,  ( 734 , '2 Upham Alley' , '' , 'El Paso' , 'TX' , '79984', 'US', '')
-- ,  ( 735 , '87013 Washington Road' , '' , 'Port Washington' , 'NY' , '11054', 'US', '')
-- ,  ( 736 , '9 Roth Place' , '' , 'Miami' , 'FL' , '33129', 'US', '')
-- ,  ( 737 , '4129 Lake View Court' , '' , 'Cape Coral' , 'FL' , '33915', 'US', '')
-- ,  ( 738 , '49 Badeau Center' , '' , 'Gainesville' , 'FL' , '32610', 'US', '')
-- ,  ( 739 , '1760 Green Circle' , '' , 'Abilene' , 'TX' , '79699', 'US', '')
-- ,  ( 740 , '6 Judy Parkway' , '' , 'Birmingham' , 'AL' , '35205', 'US', '')
-- ,  ( 741 , '2227 Hayes Trail' , '' , 'Dallas' , 'TX' , '75260', 'US', '')
-- ,  ( 742 , '545 Shelley Terrace' , '' , 'Cumming' , 'GA' , '30130', 'US', '')
-- ,  ( 743 , '0281 Shopko Lane' , '' , 'Aurora' , 'CO' , '80045', 'US', '')
-- ,  ( 744 , '394 Delaware Pass' , '' , 'Knoxville' , 'TN' , '37919', 'US', '')
-- ,  ( 745 , '54035 Cottonwood Street' , '' , 'Denver' , 'CO' , '80262', 'US', '')
-- ,  ( 746 , '75 Debs Court' , '' , 'Buffalo' , 'NY' , '14210', 'US', '')
-- ,  ( 747 , '9 Grover Trail' , '' , 'Portland' , 'OR' , '97271', 'US', '')
-- ,  ( 748 , '74348 Crescent Oaks Park' , '' , 'Rockville' , 'MD' , '20851', 'US', '')
-- ,  ( 749 , '9 Lillian Center' , '' , 'Washington' , 'DC' , '20442', 'US', '')
-- ,  ( 750 , '295 Crowley Way' , '' , 'Durham' , 'NC' , '27717', 'US', '')
-- ,  ( 751 , '7967 Fisk Trail' , '' , 'Largo' , 'FL' , '33777', 'US', '')
-- ,  ( 752 , '4766 Mayfield Alley' , '' , 'Las Vegas' , 'NV' , '89135', 'US', '')
-- ,  ( 753 , '1516 Almo Way' , '' , 'Baton Rouge' , 'LA' , '70805', 'US', '')
-- ,  ( 754 , '6309 Transport Way' , '' , 'Roanoke' , 'VA' , '24024', 'US', '')
-- ,  ( 755 , '32498 Morning Alley' , '' , 'Des Moines' , 'IA' , '50320', 'US', '')
-- ,  ( 756 , '981 Vera Circle' , '' , 'Gaithersburg' , 'MD' , '20883', 'US', '')
-- ,  ( 757 , '24352 Talmadge Way' , '' , 'New York City' , 'NY' , '10125', 'US', '')
-- ,  ( 758 , '67550 La Follette Pass' , '' , 'Washington' , 'DC' , '20409', 'US', '')
-- ,  ( 759 , '50322 Spaight Hill' , '' , 'Joliet' , 'IL' , '60435', 'US', '')
-- ,  ( 760 , '13 Rutledge Court' , '' , 'Lexington' , 'KY' , '40591', 'US', '')
-- ,  ( 761 , '4540 Hazelcrest Court' , '' , 'Dayton' , 'OH' , '45426', 'US', '')
-- ,  ( 762 , '73213 Arrowood Place' , '' , 'Jacksonville' , 'FL' , '32244', 'US', '')
-- ,  ( 763 , '03 Tennyson Trail' , '' , 'Macon' , 'GA' , '31210', 'US', '')
-- ,  ( 764 , '9053 Corben Lane' , '' , 'Fort Wayne' , 'IN' , '46805', 'US', '')
-- ,  ( 765 , '84 Grim Park' , '' , 'Riverside' , 'CA' , '92513', 'US', '')
-- ,  ( 766 , '3 Autumn Leaf Point' , '' , 'New Haven' , 'CT' , '06533', 'US', '')
-- ,  ( 767 , '2067 Orin Plaza' , '' , 'Philadelphia' , 'PA' , '19115', 'US', '')
-- ,  ( 768 , '48134 Duke Center' , '' , 'Grand Rapids' , 'MI' , '49510', 'US', '')
-- ,  ( 769 , '456 Bluejay Circle' , '' , 'Evansville' , 'IN' , '47705', 'US', '')
-- ,  ( 770 , '5 Pawling Pass' , '' , 'Tucson' , 'AZ' , '85732', 'US', '')
-- ,  ( 771 , '0247 Eastwood Avenue' , '' , 'Silver Spring' , 'MD' , '20904', 'US', '')
-- ,  ( 772 , '6 Dayton Trail' , '' , 'Colorado Springs' , 'CO' , '80945', 'US', '')
-- ,  ( 773 , '79319 Northridge Point' , '' , 'Wichita' , 'KS' , '67260', 'US', '')
-- ,  ( 774 , '458 Mayfield Lane' , '' , 'Birmingham' , 'AL' , '35231', 'US', '')
-- ,  ( 775 , '3424 Kedzie Parkway' , '' , 'Jacksonville' , 'FL' , '32277', 'US', '')
-- ,  ( 776 , '9624 Sutteridge Lane' , '' , 'Topeka' , 'KS' , '66617', 'US', '')
-- ,  ( 777 , '3220 High Crossing Lane' , '' , 'Davenport' , 'IA' , '52804', 'US', '')
-- ,  ( 778 , '23579 Kropf Parkway' , '' , 'Washington' , 'DC' , '20099', 'US', '')
-- ,  ( 779 , '59 Derek Court' , '' , 'Bowie' , 'MD' , '20719', 'US', '')
-- ,  ( 780 , '9048 Graedel Center' , '' , 'Birmingham' , 'AL' , '35254', 'US', '')
-- ,  ( 781 , '4 Messerschmidt Avenue' , '' , 'Seattle' , 'WA' , '98195', 'US', '')
-- ,  ( 782 , '488 Garrison Hill' , '' , 'Detroit' , 'MI' , '48295', 'US', '')
-- ,  ( 783 , '3 Tennyson Trail' , '' , 'Las Vegas' , 'NV' , '89166', 'US', '')
-- ,  ( 784 , '12 Lindbergh Avenue' , '' , 'Milwaukee' , 'WI' , '53234', 'US', '')
-- ,  ( 785 , '75 Porter Circle' , '' , 'Columbia' , 'SC' , '29220', 'US', '')
-- ,  ( 786 , '34579 Glacier Hill Center' , '' , 'Duluth' , 'GA' , '30096', 'US', '')
-- ,  ( 787 , '49034 Blue Bill Park Plaza' , '' , 'Kansas City' , 'MO' , '64114', 'US', '')
-- ,  ( 788 , '89 Farragut Junction' , '' , 'Oklahoma City' , 'OK' , '73129', 'US', '')
-- ,  ( 789 , '7 Briar Crest Avenue' , '' , 'Las Vegas' , 'NV' , '89105', 'US', '')
-- ,  ( 790 , '97487 Moulton Avenue' , '' , 'Savannah' , 'GA' , '31405', 'US', '')
-- ,  ( 791 , '57309 Sundown Center' , '' , 'Chandler' , 'AZ' , '85246', 'US', '')
-- ,  ( 792 , '39 Nevada Way' , '' , 'Charlottesville' , 'VA' , '22908', 'US', '')
-- ,  ( 793 , '51194 Granby Drive' , '' , 'Augusta' , 'GA' , '30905', 'US', '')
-- ,  ( 794 , '83468 Colorado Place' , '' , 'Baton Rouge' , 'LA' , '70836', 'US', '')
-- ,  ( 795 , '89847 Weeping Birch Alley' , '' , 'Tampa' , 'FL' , '33661', 'US', '')
-- ,  ( 796 , '2 Emmet Lane' , '' , 'Scottsdale' , 'AZ' , '85255', 'US', '')
-- ,  ( 797 , '041 Independence Drive' , '' , 'Worcester' , 'MA' , '01605', 'US', '')
-- ,  ( 798 , '93 Monterey Avenue' , '' , 'New York City' , 'NY' , '10024', 'US', '')
-- ,  ( 799 , '0 Bultman Street' , '' , 'Cincinnati' , 'OH' , '45203', 'US', '')
-- ,  ( 800 , '68781 Jackson Street' , '' , 'Richmond' , 'VA' , '23228', 'US', '')
-- ,  ( 801 , '2209 Glendale Junction' , '' , 'Dallas' , 'TX' , '75241', 'US', '')
-- ,  ( 802 , '1 1st Park' , '' , 'Austin' , 'TX' , '78710', 'US', '')
-- ,  ( 803 , '9370 Mifflin Parkway' , '' , 'Tucson' , 'AZ' , '85737', 'US', '')
-- ,  ( 804 , '845 Fieldstone Drive' , '' , 'Roanoke' , 'VA' , '24014', 'US', '')
-- ,  ( 805 , '98 Gale Drive' , '' , 'Orlando' , 'FL' , '32819', 'US', '')
-- ,  ( 806 , '000 Briar Crest Parkway' , '' , 'Toledo' , 'OH' , '43635', 'US', '')
-- ,  ( 807 , '30 Elgar Road' , '' , 'Oakland' , 'CA' , '94605', 'US', '')
-- ,  ( 808 , '47950 Esker Way' , '' , 'San Antonio' , 'TX' , '78245', 'US', '')
-- ,  ( 809 , '6759 Butternut Street' , '' , 'Philadelphia' , 'PA' , '19093', 'US', '')
-- ,  ( 810 , '76 Montana Parkway' , '' , 'Newport News' , 'VA' , '23605', 'US', '')
-- ,  ( 811 , '18787 Doe Crossing Junction' , '' , 'Corpus Christi' , 'TX' , '78415', 'US', '')
-- ,  ( 812 , '2 Dunning Point' , '' , 'Miami' , 'FL' , '33158', 'US', '')
-- ,  ( 813 , '82688 Graceland Street' , '' , 'Santa Barbara' , 'CA' , '93106', 'US', '')
-- ,  ( 814 , '05110 Sunbrook Place' , '' , 'Tulsa' , 'OK' , '74116', 'US', '')
-- ,  ( 815 , '2361 Sugar Pass' , '' , 'New Bedford' , 'MA' , '02745', 'US', '')
-- ,  ( 816 , '21 Esch Park' , '' , 'Iowa City' , 'IA' , '52245', 'US', '')
-- ,  ( 817 , '396 Shelley Place' , '' , 'Rochester' , 'MN' , '55905', 'US', '')
-- ,  ( 818 , '7 Northport Road' , '' , 'Chicago' , 'IL' , '60681', 'US', '')
-- ,  ( 819 , '98181 Park Meadow Place' , '' , 'New York City' , 'NY' , '10090', 'US', '')
-- ,  ( 820 , '1 Colorado Avenue' , '' , 'Charlotte' , 'NC' , '28272', 'US', '')
-- ,  ( 821 , '63 Green Ridge Crossing' , '' , 'Jamaica' , 'NY' , '11499', 'US', '')
-- ,  ( 822 , '772 Buhler Park' , '' , 'Berkeley' , 'CA' , '94712', 'US', '')
-- ,  ( 823 , '52559 Summit Drive' , '' , 'Albuquerque' , 'NM' , '87105', 'US', '')
-- ,  ( 824 , '7 Kipling Lane' , '' , 'Nashville' , 'TN' , '37215', 'US', '')
-- ,  ( 825 , '45 Grasskamp Center' , '' , 'San Jose' , 'CA' , '95155', 'US', '')
-- ,  ( 826 , '0 Northview Hill' , '' , 'New York City' , 'NY' , '10203', 'US', '')
-- ,  ( 827 , '5 Clarendon Lane' , '' , 'Mesquite' , 'TX' , '75185', 'US', '')
-- ,  ( 828 , '675 Stoughton Center' , '' , 'Houston' , 'TX' , '77212', 'US', '')
-- ,  ( 829 , '76668 Schurz Point' , '' , 'Dallas' , 'TX' , '75397', 'US', '')
-- ,  ( 830 , '2 Maywood Drive' , '' , 'Fort Worth' , 'TX' , '76178', 'US', '')
-- ,  ( 831 , '01394 Independence Parkway' , '' , 'El Paso' , 'TX' , '79977', 'US', '')
-- ,  ( 832 , '2172 Schiller Lane' , '' , 'Saint Paul' , 'MN' , '55123', 'US', '')
-- ,  ( 833 , '30 Eggendart Street' , '' , 'Colorado Springs' , 'CO' , '80945', 'US', '')
-- ,  ( 834 , '1 Kennedy Trail' , '' , 'Miami' , 'FL' , '33185', 'US', '')
-- ,  ( 835 , '68361 Eagan Alley' , '' , 'Nashville' , 'TN' , '37240', 'US', '')
-- ,  ( 836 , '6268 Rutledge Hill' , '' , 'Pasadena' , 'TX' , '77505', 'US', '')
-- ,  ( 837 , '83 Sherman Junction' , '' , 'Wichita Falls' , 'TX' , '76310', 'US', '')
-- ,  ( 838 , '649 Aberg Parkway' , '' , 'Newark' , 'NJ' , '07188', 'US', '')
-- ,  ( 839 , '78794 Merry Road' , '' , 'Elizabeth' , 'NJ' , '07208', 'US', '')
-- ,  ( 840 , '9 Oakridge Junction' , '' , 'Idaho Falls' , 'ID' , '83405', 'US', '')
-- ,  ( 841 , '25 Bashford Parkway' , '' , 'New Brunswick' , 'NJ' , '08922', 'US', '')
-- ,  ( 842 , '04 Merrick Parkway' , '' , 'Syracuse' , 'NY' , '13224', 'US', '')
-- ,  ( 843 , '26 Tennessee Point' , '' , 'Atlanta' , 'GA' , '31106', 'US', '')
-- ,  ( 844 , '2281 Birchwood Park' , '' , 'El Paso' , 'TX' , '79950', 'US', '')
-- ,  ( 845 , '48222 Ridgeway Circle' , '' , 'Beaufort' , 'SC' , '29905', 'US', '')
-- ,  ( 846 , '62 Banding Street' , '' , 'Austin' , 'TX' , '78764', 'US', '')
-- ,  ( 847 , '53598 Butternut Trail' , '' , 'Madison' , 'WI' , '53705', 'US', '')
-- ,  ( 848 , '87540 Sundown Point' , '' , 'Portland' , 'OR' , '97221', 'US', '')
-- ,  ( 849 , '6172 Cascade Avenue' , '' , 'Hicksville' , 'NY' , '11854', 'US', '')
-- ,  ( 850 , '14846 Sugar Plaza' , '' , 'Watertown' , 'MA' , '02472', 'US', '')
-- ,  ( 851 , '6606 Old Shore Way' , '' , 'Staten Island' , 'NY' , '10310', 'US', '')
-- ,  ( 852 , '0 Warner Circle' , '' , 'Orlando' , 'FL' , '32859', 'US', '')
-- ,  ( 853 , '56224 Melvin Court' , '' , 'Los Angeles' , 'CA' , '90189', 'US', '')
-- ,  ( 854 , '70 Hoard Way' , '' , 'Raleigh' , 'NC' , '27605', 'US', '')
-- ,  ( 855 , '3101 Division Drive' , '' , 'Baltimore' , 'MD' , '21216', 'US', '')
-- ,  ( 856 , '3231 Bultman Lane' , '' , 'Utica' , 'NY' , '13505', 'US', '')
-- ,  ( 857 , '6670 Clemons Hill' , '' , 'Louisville' , 'KY' , '40287', 'US', '')
-- ,  ( 858 , '77655 Grayhawk Center' , '' , 'Carlsbad' , 'CA' , '92013', 'US', '')
-- ,  ( 859 , '8 Warrior Junction' , '' , 'Youngstown' , 'OH' , '44555', 'US', '')
-- ,  ( 860 , '05360 Messerschmidt Lane' , '' , 'Trenton' , 'NJ' , '08619', 'US', '')
-- ,  ( 861 , '47 Dapin Street' , '' , 'Fort Myers' , 'FL' , '33906', 'US', '')
-- ,  ( 862 , '563 Debs Center' , '' , 'Honolulu' , 'HI' , '96835', 'US', '')
-- ,  ( 863 , '13575 Mitchell Parkway' , '' , 'Houston' , 'TX' , '77223', 'US', '')
-- ,  ( 864 , '03 American Center' , '' , 'Burbank' , 'CA' , '91520', 'US', '')
-- ,  ( 865 , '79 Northland Avenue' , '' , 'Miami' , 'FL' , '33158', 'US', '')
-- ,  ( 866 , '92 Swallow Road' , '' , 'Ogden' , 'UT' , '84403', 'US', '')
-- ,  ( 867 , '2633 Hoffman Trail' , '' , 'Des Moines' , 'IA' , '50369', 'US', '')
-- ,  ( 868 , '8023 Huxley Plaza' , '' , 'Chattanooga' , 'TN' , '37416', 'US', '')
-- ,  ( 869 , '1 Luster Parkway' , '' , 'Flint' , 'MI' , '48505', 'US', '')
-- ,  ( 870 , '83813 Blackbird Way' , '' , 'Saint Petersburg' , 'FL' , '33705', 'US', '')
-- ,  ( 871 , '917 Becker Place' , '' , 'Louisville' , 'KY' , '40210', 'US', '')
-- ,  ( 872 , '876 Scott Way' , '' , 'Bakersfield' , 'CA' , '93399', 'US', '')
-- ,  ( 873 , '0085 Mifflin Place' , '' , 'Sunnyvale' , 'CA' , '94089', 'US', '')
-- ,  ( 874 , '067 Hoard Hill' , '' , 'Daytona Beach' , 'FL' , '32123', 'US', '')
-- ,  ( 875 , '88517 Eagle Crest Trail' , '' , 'Fort Wayne' , 'IN' , '46825', 'US', '')
-- ,  ( 876 , '65300 Welch Parkway' , '' , 'Greenville' , 'SC' , '29615', 'US', '')
-- ,  ( 877 , '637 Talmadge Avenue' , '' , 'Grand Junction' , 'CO' , '81505', 'US', '')
-- ,  ( 878 , '04050 Bluejay Trail' , '' , 'Miami' , 'FL' , '33129', 'US', '')
-- ,  ( 879 , '348 Pankratz Point' , '' , 'Madison' , 'WI' , '53710', 'US', '')
-- ,  ( 880 , '6547 Thompson Court' , '' , 'Decatur' , 'GA' , '30089', 'US', '')
-- ,  ( 881 , '84600 Elmside Trail' , '' , 'Newton' , 'MA' , '02162', 'US', '')
-- ,  ( 882 , '20 Veith Hill' , '' , 'Athens' , 'GA' , '30605', 'US', '')
-- ,  ( 883 , '5297 Kropf Center' , '' , 'Dallas' , 'TX' , '75231', 'US', '')
-- ,  ( 884 , '4653 Dovetail Way' , '' , 'Englewood' , 'CO' , '80150', 'US', '')
-- ,  ( 885 , '65854 Lien Point' , '' , 'San Francisco' , 'CA' , '94147', 'US', '')
-- ,  ( 886 , '59 Moland Street' , '' , 'Orange' , 'CA' , '92668', 'US', '')
-- ,  ( 887 , '30604 Badeau Street' , '' , 'Washington' , 'DC' , '20540', 'US', '')
-- ,  ( 888 , '7 Kinsman Drive' , '' , 'Houston' , 'TX' , '77271', 'US', '')
-- ,  ( 889 , '57213 Dennis Street' , '' , 'Gulfport' , 'MS' , '39505', 'US', '')
-- ,  ( 890 , '68869 Rockefeller Drive' , '' , 'Pasadena' , 'CA' , '91103', 'US', '')
-- ,  ( 891 , '8851 Welch Court' , '' , 'Atlanta' , 'GA' , '31196', 'US', '')
-- ,  ( 892 , '082 Old Shore Lane' , '' , 'Buffalo' , 'NY' , '14276', 'US', '')
-- ,  ( 893 , '3883 Commercial Terrace' , '' , 'Redwood City' , 'CA' , '94064', 'US', '')
-- ,  ( 894 , '26623 Hoepker Hill' , '' , 'Memphis' , 'TN' , '38168', 'US', '')
-- ,  ( 895 , '2 Garrison Park' , '' , 'Tucson' , 'AZ' , '85732', 'US', '')
-- ,  ( 896 , '46334 Westridge Road' , '' , 'West Hartford' , 'CT' , '06127', 'US', '')
-- ,  ( 897 , '60 Jenifer Plaza' , '' , 'Houston' , 'TX' , '77276', 'US', '')
-- ,  ( 898 , '8 Springview Place' , '' , 'Dallas' , 'TX' , '75251', 'US', '')
-- ,  ( 899 , '9 Del Sol Pass' , '' , 'Monroe' , 'LA' , '71213', 'US', '')
-- ,  ( 900 , '77442 Linden Point' , '' , 'Bakersfield' , 'CA' , '93399', 'US', '')
-- ,  ( 901 , '43638 Melody Drive' , '' , 'Stamford' , 'CT' , '06912', 'US', '')
-- ,  ( 902 , '0890 Kenwood Center' , '' , 'Pittsburgh' , 'PA' , '15274', 'US', '')
-- ,  ( 903 , '34 Forest Place' , '' , 'Chattanooga' , 'TN' , '37410', 'US', '')
-- ,  ( 904 , '13854 Farwell Street' , '' , 'Clearwater' , 'FL' , '34615', 'US', '')
-- ,  ( 905 , '1 Milwaukee Street' , '' , 'El Paso' , 'TX' , '79916', 'US', '')
-- ,  ( 906 , '05858 Fordem Avenue' , '' , 'Brea' , 'CA' , '92822', 'US', '')
-- ,  ( 907 , '1739 Lakewood Park' , '' , 'Newton' , 'MA' , '02162', 'US', '')
-- ,  ( 908 , '5 Carpenter Drive' , '' , 'Akron' , 'OH' , '44310', 'US', '')
-- ,  ( 909 , '12 Harbort Way' , '' , 'Boston' , 'MA' , '02104', 'US', '')
-- ,  ( 910 , '68 Mockingbird Point' , '' , 'Waco' , 'TX' , '76705', 'US', '')
-- ,  ( 911 , '605 Cardinal Terrace' , '' , 'Atlanta' , 'GA' , '30323', 'US', '')
-- ,  ( 912 , '22270 Division Crossing' , '' , 'Jackson' , 'MS' , '39296', 'US', '')
-- ,  ( 913 , '97829 Menomonie Plaza' , '' , 'Charlotte' , 'NC' , '28220', 'US', '')
-- ,  ( 914 , '8469 Evergreen Place' , '' , 'Fort Lauderdale' , 'FL' , '33336', 'US', '')
-- ,  ( 915 , '10452 Schmedeman Crossing' , '' , 'Los Angeles' , 'CA' , '90055', 'US', '')
-- ,  ( 916 , '03917 Thompson Place' , '' , 'Reno' , 'NV' , '89595', 'US', '')
-- ,  ( 917 , '8 Valley Edge Alley' , '' , 'Young America' , 'MN' , '55551', 'US', '')
-- ,  ( 918 , '907 Mitchell Pass' , '' , 'New Orleans' , 'LA' , '70129', 'US', '')
-- ,  ( 919 , '443 Sycamore Place' , '' , 'Sarasota' , 'FL' , '34276', 'US', '')
-- ,  ( 920 , '667 Gale Trail' , '' , 'Portland' , 'OR' , '97255', 'US', '')
-- ,  ( 921 , '5233 Anniversary Circle' , '' , 'Baltimore' , 'MD' , '21290', 'US', '')
-- ,  ( 922 , '188 Vidon Street' , '' , 'Atlanta' , 'GA' , '30323', 'US', '')
-- ,  ( 923 , '40296 Mifflin Trail' , '' , 'New Orleans' , 'LA' , '70149', 'US', '')
-- ,  ( 924 , '955 Stuart Junction' , '' , 'Birmingham' , 'AL' , '35285', 'US', '')
-- ,  ( 925 , '06986 Eggendart Way' , '' , 'Albany' , 'NY' , '12227', 'US', '')
-- ,  ( 926 , '446 Arkansas Center' , '' , 'San Diego' , 'CA' , '92145', 'US', '')
-- ,  ( 927 , '473 Farmco Point' , '' , 'Oklahoma City' , 'OK' , '73114', 'US', '')
-- ,  ( 928 , '0 Alpine Park' , '' , 'Gainesville' , 'GA' , '30506', 'US', '')
-- ,  ( 929 , '9422 Hazelcrest Alley' , '' , 'Washington' , 'DC' , '20215', 'US', '')
-- ,  ( 930 , '6 West Trail' , '' , 'Jamaica' , 'NY' , '11447', 'US', '')
-- ,  ( 931 , '7 Corscot Pass' , '' , 'Cleveland' , 'OH' , '44197', 'US', '')
-- ,  ( 932 , '307 2nd Parkway' , '' , 'Bonita Springs' , 'FL' , '34135', 'US', '')
-- ,  ( 933 , '66 Dixon Place' , '' , 'Las Vegas' , 'NV' , '89150', 'US', '')
-- ,  ( 934 , '800 Lindbergh Terrace' , '' , 'Naperville' , 'IL' , '60567', 'US', '')
-- ,  ( 935 , '58291 Sugar Pass' , '' , 'Dallas' , 'TX' , '75205', 'US', '')
-- ,  ( 936 , '976 Calypso Way' , '' , 'Colorado Springs' , 'CO' , '80920', 'US', '')
-- ,  ( 937 , '22 Corscot Alley' , '' , 'Philadelphia' , 'PA' , '19196', 'US', '')
-- ,  ( 938 , '679 Sunnyside Center' , '' , 'Miami' , 'FL' , '33129', 'US', '')
-- ,  ( 939 , '10 Farragut Hill' , '' , 'New York City' , 'NY' , '10039', 'US', '')
-- ,  ( 940 , '9 Hermina Alley' , '' , 'Baltimore' , 'MD' , '21282', 'US', '')
-- ,  ( 941 , '29293 Russell Crossing' , '' , 'Seattle' , 'WA' , '98133', 'US', '')
-- ,  ( 942 , '2282 Carey Avenue' , '' , 'Dayton' , 'OH' , '45470', 'US', '')
-- ,  ( 943 , '126 Elka Trail' , '' , 'Boise' , 'ID' , '83727', 'US', '')
-- ,  ( 944 , '38465 Dayton Park' , '' , 'Spokane' , 'WA' , '99220', 'US', '')
-- ,  ( 945 , '5011 Luster Junction' , '' , 'Charlotte' , 'NC' , '28278', 'US', '')
-- ,  ( 946 , '64 Kings Point' , '' , 'Washington' , 'DC' , '20238', 'US', '')
-- ,  ( 947 , '7 Bartillon Trail' , '' , 'Birmingham' , 'AL' , '35279', 'US', '')
-- ,  ( 948 , '3033 Fisk Trail' , '' , 'Peoria' , 'IL' , '61629', 'US', '')
-- ,  ( 949 , '0623 Daystar Circle' , '' , 'El Paso' , 'TX' , '79905', 'US', '')
-- ,  ( 950 , '31430 Karstens Drive' , '' , 'Tempe' , 'AZ' , '85284', 'US', '')
-- ,  ( 951 , '36 Anhalt Junction' , '' , 'Houston' , 'TX' , '77245', 'US', '')
-- ,  ( 952 , '54 Banding Trail' , '' , 'Tallahassee' , 'FL' , '32304', 'US', '')
-- ,  ( 953 , '6343 Cottonwood Court' , '' , 'Southfield' , 'MI' , '48076', 'US', '')
-- ,  ( 954 , '4087 Esker Pass' , '' , 'Saint Paul' , 'MN' , '55188', 'US', '')
-- ,  ( 955 , '911 Mayfield Street' , '' , 'Springfield' , 'MA' , '01105', 'US', '')
-- ,  ( 956 , '999 Red Cloud Hill' , '' , 'New York City' , 'NY' , '10120', 'US', '')
-- ,  ( 957 , '01 Knutson Place' , '' , 'Washington' , 'DC' , '20566', 'US', '')
-- ,  ( 958 , '17509 Del Mar Parkway' , '' , 'Naples' , 'FL' , '34102', 'US', '')
-- ,  ( 959 , '690 Merrick Drive' , '' , 'Richmond' , 'VA' , '23289', 'US', '')
-- ,  ( 960 , '86 Columbus Road' , '' , 'Des Moines' , 'IA' , '50320', 'US', '')
-- ,  ( 961 , '88 Schlimgen Way' , '' , 'Anaheim' , 'CA' , '92805', 'US', '')
-- ,  ( 962 , '4 Mallard Street' , '' , 'Fayetteville' , 'NC' , '28314', 'US', '')
-- ,  ( 963 , '1234 Magdeline Alley' , '' , 'Shawnee Mission' , 'KS' , '66210', 'US', '')
-- ,  ( 964 , '6 Pine View Center' , '' , 'Montpelier' , 'VT' , '05609', 'US', '')
-- ,  ( 965 , '1 Di Loreto Parkway' , '' , 'Shawnee Mission' , 'KS' , '66215', 'US', '')
-- ,  ( 966 , '7920 New Castle Trail' , '' , 'Pittsburgh' , 'PA' , '15261', 'US', '')
-- ,  ( 967 , '1584 Gina Point' , '' , 'Miami' , 'FL' , '33175', 'US', '')
-- ,  ( 968 , '04 Superior Avenue' , '' , 'Lancaster' , 'CA' , '93584', 'US', '')
-- ,  ( 969 , '8350 Scoville Way' , '' , 'Nashville' , 'TN' , '37235', 'US', '')
-- ,  ( 970 , '196 Knutson Circle' , '' , 'Hyattsville' , 'MD' , '20784', 'US', '')
-- ,  ( 971 , '9 Clarendon Trail' , '' , 'New Haven' , 'CT' , '06510', 'US', '')
-- ,  ( 972 , '6000 Pennsylvania Place' , '' , 'Harrisburg' , 'PA' , '17110', 'US', '')
-- ,  ( 973 , '7 Beilfuss Trail' , '' , 'Portland' , 'OR' , '97240', 'US', '')
-- ,  ( 974 , '315 Garrison Alley' , '' , 'Minneapolis' , 'MN' , '55487', 'US', '')
-- ,  ( 975 , '815 Artisan Crossing' , '' , 'Saint Louis' , 'MO' , '63196', 'US', '')
-- ,  ( 976 , '8 Paget Hill' , '' , 'Omaha' , 'NE' , '68117', 'US', '')
-- ,  ( 977 , '21 Nevada Circle' , '' , 'Honolulu' , 'HI' , '96810', 'US', '')
-- ,  ( 978 , '23 Heffernan Plaza' , '' , 'San Jose' , 'CA' , '95160', 'US', '')
-- ,  ( 979 , '39 Westport Drive' , '' , 'Portland' , 'OR' , '97221', 'US', '')
-- ,  ( 980 , '2 Katie Drive' , '' , 'Corpus Christi' , 'TX' , '78465', 'US', '')
-- ,  ( 981 , '7564 Evergreen Road' , '' , 'Jefferson City' , 'MO' , '65110', 'US', '')
-- ,  ( 982 , '671 Fuller Hill' , '' , 'Saint Louis' , 'MO' , '63110', 'US', '')
-- ,  ( 983 , '6 Vera Place' , '' , 'Honolulu' , 'HI' , '96845', 'US', '')
-- ,  ( 984 , '4988 Barby Way' , '' , 'Indianapolis' , 'IN' , '46231', 'US', '')
-- ,  ( 985 , '9747 Morningstar Crossing' , '' , 'Jacksonville' , 'FL' , '32215', 'US', '')
-- ,  ( 986 , '9700 Banding Center' , '' , 'Fort Worth' , 'TX' , '76129', 'US', '')
-- ,  ( 987 , '75 Birchwood Trail' , '' , 'New York City' , 'NY' , '10280', 'US', '')
-- ,  ( 988 , '5087 Coleman Way' , '' , 'Buffalo' , 'NY' , '14276', 'US', '')
-- ,  ( 989 , '3087 Mockingbird Hill' , '' , 'Philadelphia' , 'PA' , '19178', 'US', '')
-- ,  ( 990 , '26080 Roxbury Way' , '' , 'Pasadena' , 'CA' , '91103', 'US', '')
-- ,  ( 991 , '99 Rockefeller Park' , '' , 'Memphis' , 'TN' , '38104', 'US', '')
-- ,  ( 992 , '4426 Ryan Road' , '' , 'Dallas' , 'TX' , '75392', 'US', '')
-- ,  ( 993 , '48512 Maryland Center' , '' , 'Albany' , 'NY' , '12205', 'US', '')
-- ,  ( 994 , '598 Rutledge Court' , '' , 'Huntington' , 'WV' , '25721', 'US', '')
-- ,  ( 995 , '3 Lillian Court' , '' , 'San Diego' , 'CA' , '92186', 'US', '')
-- ,  ( 996 , '4 Ilene Parkway' , '' , 'Hollywood' , 'FL' , '33023', 'US', '')
-- ,  ( 997 , '47 Fair Oaks Avenue' , '' , 'El Paso' , 'TX' , '88569', 'US', '')
-- ,  ( 998 , '77 Rigney Park' , '' , 'Philadelphia' , 'PA' , '19141', 'US', '')
-- ,  ( 999 , '709 Veith Road' , '' , 'Pasadena' , 'CA' , '91125', 'US', '')
-- ,  ( 1000 , '75 Little Fleur Street' , '' , 'Corpus Christi' , 'TX' , '78410', 'US', '')
-- ,  ( 1001 , '153 First St.' , '' , 'New York' , 'NY' , '10011', 'US', '')
--	 ) AS Source ( [ID], [Address1], [Address2],
--					[City], [StateCode], [Zip], [CountryCode], [Province] )
--ON ( Target.[ID] = Source.[ID] )
--WHEN MATCHED AND ( NULLIF(Source.[Address1], Target.[Address1]) IS NOT NULL
--				   OR NULLIF(Target.[Address1], Source.[Address1]) IS NOT NULL
--				   OR NULLIF(Source.[Address2], Target.[Address2]) IS NOT NULL
--				   OR NULLIF(Target.[Address2], Source.[Address2]) IS NOT NULL
--				   OR NULLIF(Source.[City], Target.[City]) IS NOT NULL
--				   OR NULLIF(Target.[City], Source.[City]) IS NOT NULL
--				   OR NULLIF(Source.[StateCode], Target.[StateCode]) IS NOT NULL
--				   OR NULLIF(Target.[StateCode], Source.[StateCode]) IS NOT NULL
--				   OR NULLIF(Source.[Zip], Target.[Zip]) IS NOT NULL
--				   OR NULLIF(Target.[Zip], Source.[Zip]) IS NOT NULL
--				   OR NULLIF(Source.[CountryCode], Target.[CountryCode]) IS NOT NULL
--				   OR NULLIF(Target.[CountryCode], Source.[CountryCode]) IS NOT NULL
--				   OR NULLIF(Source.[Province], Target.[Province]) IS NOT NULL
--				   OR NULLIF(Target.[Province], Source.[Province]) IS NOT NULL
--				 ) THEN
--	UPDATE SET [Address1] = Source.[Address1] ,
--			   [Address2] = Source.[Address2] ,
--			   [City] = Source.[City] ,
--			   [StateCode] = Source.[StateCode] ,
--			   [Zip] = Source.[Zip] ,
--               [CountryCode] = Source.[CountryCode] ,
--               [Province] = Source.[Province]
--WHEN NOT MATCHED BY TARGET THEN
--	INSERT ( [ID] ,
--			 [Address1] ,
--			 [Address2] ,
--			 [City] ,
--			 [StateCode] ,
--			 [Zip] ,
--             [CountryCode] ,
--             [Province] 
--		   )
--	VALUES ( Source.[ID] ,
--			 Source.[Address1] ,
--			 Source.[Address2] ,
--			 Source.[City] ,
--			 Source.[StateCode] ,
--			 Source.[Zip] ,
--             Source.[CountryCode] ,
--             Source.[Province]
--		   );
--SET IDENTITY_INSERT Addresses OFF;

-- User
SET IDENTITY_INSERT dbo.Users ON;
MERGE INTO Users AS Target
USING (VALUES 
(2, 'William', 'Taft', 'taft@4miles.com', NULL, 2),
(3, 'Grover', 'Cleveland', 'geeclee@4miles.com', NULL, 3),
(4, 'George', 'Washington', 'washington@4miles.com', NULL, 4),
(5, 'Rutherford', 'Hayes', 'hayes@4miles.com', NULL, 5),
(6, 'Harry', 'Truman', 'truman@4miles.com', NULL, 6),
(7, 'Franklin', 'Roosevelt', 'roosevelt@4miles.com', NULL, 7),
(8, 'Coy', 'Taft', 'coytaft@4miles.com', NULL, 8),
(9, 'William', 'Harrison', 'harrison@4miles.com', NULL, 9),
(10, 'Martin', 'Van Buren', 'vanburen@4miles.com', NULL, 10),
(11, 'Zachary', 'Taylor', 'taylor@4miles.com', NULL, 11),
(12, 'James', 'Polk', 'polk@4miles.com', NULL, 12)
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

 -- Customers
SET IDENTITY_INSERT [Customers] ON;
MERGE INTO [Customers] AS Target
USING (
VALUES 
	(1, 'Blognation', 1, 1),
(2,'Browsedrive',1,1),
(3,'Kayveo',1,1),
(4,'Meevee',1,1),
(5,'Camido',1,1),
(6,'Devshare',1,1),
(7,'Mydo',1,1),
(8,'Youopia',1,1),
(9,'Flipbug',1,1),
(10,'Yambee',1,1),
(11,'Kwilith',1,1),
(12,'Vimbo',1,1),
(13,'Bluezoom',1,1),
(14,'Eazzy',1,1),
(15,'Dazzlesphere',1,1),
(16,'Innojam',1,1),
(17,'Miboo',1,1),
(18,'Jazzy',1,1),
(19,'Zoovu',1,1),
(20,'Meevee',1,1),
(21,'Buzzdog',1,1),
(22,'Jabbertype',1,1),
(23,'Tanoodle',1,1),
(24,'Oyonder',1,1),
(25,'Gigaclub',1,1),
(26,'Podcat',1,1),
(27,'Gabspot',1,1),
(28,'Meemm',1,1),
(29,'Twitternation',1,1),
(30,'Shufflester',1,1),
(31,'Gabtype',1,1),
(32,'Teklist',1,1),
(33,'Edgepulse',1,1),
(34,'Livefish',1,1),
(35,'Shuffledrive',1,1),
(36,'Eamia',1,1),
(37,'Youtags',1,1),
(38,'Rooxo',1,1),
(39,'Flipstorm',1,1),
(40,'Realpoint',1,1),
(41,'Riffpedia',1,1),
(42,'Zoozzy',1,1),
(43,'Brainverse',1,1),
(44,'Zoomcast',1,1),
(45,'Meemm',1,1),
(46,'Roomm',1,1),
(47,'Agimba Telecoms',1,1),
(48,'Linkbuzz',1,1),
(49,'Flashset',1,1),
(50,'Gigaclub',1,1),
(51,'Flashdog',1,1),
(52,'Gabspot',1,1),
(53,'Oyondu',1,1),
(54,'Jabbertype',1,1),
(55,'Twitterbeat',1,1),
(56,'Wordware',1,1),
(57,'Katz',1,1),
(58,'JumpXS',1,1),
(59,'Gigabox',1,1),
(60,'Camimbo',1,1),
(61,'Oyoyo',1,1),
(62,'Tagtune',1,1),
(63,'Mybuzz',1,1),
(64,'Yoveo',1,1),
(65,'Vinte',1,1),
(66,'Kazu',1,1),
(67,'Dabjam',1,1),
(68,'Jabbersphere',1,1),
(69,'Youbridge',1,1),
(70,'Centidel',1,1),
(71,'Fivechat',1,1),
(72,'Vidoo',1,1),
(73,'Oyoyo',1,1),
(74,'Buzzdog',1,1),
(75,'Browsebug',1,1),
(76,'Mydo',1,1),
(77,'Twitterworks',1,1),
(78,'Geba',1,1),
(79,'Yata',1,1),
(80,'Feedspan',1,1),
(81,'Edgeblab',1,1),
(82,'Livepath',1,1),
(83,'Roodel',1,1),
(84,'Dablist',1,1),
(85,'Thoughtbridge',1,1),
(86,'Oba',1,1),
(87,'Photospace',1,1),
(88,'Thoughtbeat',1,1),
(89,'Linkbridge',1,1),
(90,'Quinu',1,1),
(91,'Twitterbeat',1,1),
(92,'Fliptune',1,1),
(93,'Rhyzio',1,1),
(94,'Wikizz',1,1),
(95,'Skinder',1,1),
(96,'Kwilith',1,1),
(97,'Edgeify',1,1),
(98,'Mynte',1,1),
(99,'Oyoba',1,1),
(100,'Oyoloo',1,1),
(101,'Youtags',1,1),
(102,'Tagpad',1,1),
(103,'Zoovu',1,1),
(104,'LiveZ',1,1),
(105,'Camimbo',1,1),
(106,'Topiczoom',1,1),
(107,'Browsetype',1,1),
(108,'Kayveo',1,1),
(109,'Aimbo',1,1),
(110,'Quinu',1,1),
(111,'Wikizz',1,1),
(112,'Devbug',1,1),
(113,'Thoughtbridge',1,1),
(114,'Viva',1,1),
(115,'Wordtune',1,1),
(116,'Thoughtblab',1,1),
(117,'Oloo',1,1),
(118,'Yodel',1,1),
(119,'Roombo',1,1),
(120,'Photobug',1,1),
(121,'Dablist',1,1),
(122,'Ooba',1,1),
(123,'Quimm',1,1),
(124,'Reallinks',1,1),
(125,'Dynava',1,1),
(126,'Oozz',1,1),
(127,'Pixope',1,1),
(128,'Jaxworks',1,1),
(129,'Riffpath',1,1),
(130,'Brightbean',1,1),
(131,'Wikibox',1,1),
(132,'Lajo',1,1),
(133,'Tanoodle',1,1),
(134,'DabZ',1,1),
(135,'Bubblemix',1,1),
(136,'Meejo',1,1),
(137,'Realblab',1,1),
(138,'Realbuzz',1,1),
(139,'Zoomlounge',1,1),
(140,'Aimbu',1,1),
(141,'Meejo',1,1),
(142,'Teklist',1,1),
(143,'Reallinks',1,1),
(144,'Demizz',1,1),
(145,'Tagpad',1,1),
(146,'Gigazoom',1,1),
(147,'DabZ',1,1),
(148,'Wikido',1,1),
(149,'Plajo',1,1),
(150,'Zazio',1,1),
(151,'Leenti',1,1),
(152,'Topdrive',1,1),
(153,'Bubblebox',1,1),
(154,'Browsezoom',1,1),
(155,'Zoovu',1,1),
(156,'Eamia',1,1),
(157,'Youtags',1,1),
(158,'Buzzster',1,1),
(159,'Meejo',1,1),
(160,'Fivechat',1,1),
(161,'Vinte',1,1),
(162,'Buzzbean',1,1),
(163,'Quatz',1,1),
(164,'Mydo',1,1),
(165,'Vinte',1,1),
(166,'Skaboo',1,1),
(167,'Dazzlesphere',1,1),
(168,'Eare',1,1),
(169,'Topdrive',1,1),
(170,'Fivechat',1,1),
(171,'Rhybox',1,1),
(172,'Camido',1,1),
(173,'Meemm',1,1),
(174,'Aibox',1,1),
(175,'Browsezoom',1,1),
(176,'Skippad',1,1),
(177,'Trudeo',1,1),
(178,'Wikibox',1,1),
(179,'Avavee',1,1),
(180,'Viva',1,1),
(181,'Thoughtsphere',1,1),
(182,'Tank Store',1,1),
(183,'Jetwire',1,1),
(184,'Tagcat',1,1),
(185,'Rhyloo',1,1),
(186,'Browseblab',1,1),
(187,'Edgeify',1,1),
(188,'Abb Pro',1,1),
(189,'Babbleblab',1,1),
(190,'Rhynyx',1,1),
(191,'Jetwire',1,1),
(192,'Oyoloo',1,1),
(193,'Jaxnation',1,1),
(194,'Teklist',1,1),
(195,'Fiveclub',1,1),
(196,'Thoughtworks',1,1),
(197,'Minyx',1,1),
(198,'Skippad',1,1),
(199,'Edgewire',1,1),
(200,'Feedfire',1,1),
(201,'Mudo',1,1),
(202,'Feednation',1,1),
(203,'Trudoo',1,1),
(204,'Flipbug',1,1),
(205,'Bubblebox',1,1),
(206,'Devpulse',1,1),
(207,'Rhyzio',1,1),
(208,'Edgepulse',1,1),
(209,'Realblab',1,1),
(210,'Jaloo',1,1),
(211,'Thoughtstorm',1,1),
(212,'Divavu',1,1),
(213,'Linklinks',1,1),
(214,'Tekfly',1,1),
(215,'Brainverse',1,1),
(216,'Skidoo',1,1),
(217,'Yozio',1,1),
(218,'Tagtune',1,1),
(219,'Topiczoom',1,1),
(220,'Kare',1,1),
(221,'Tagchat',1,1),
(222,'Kwinu',1,1),
(223,'Buzzster',1,1),
(224,'Shufflebeat',1,1),
(225,'Roombo',1,1),
(226,'Oba',1,1),
(227,'Eimbee',1,1),
(228,'Pixoboo',1,1),
(229,'Agave Sweater Inc.',1,1),
(230,'Skiba',1,1),
(231,'Kwinu',1,1),
(232,'Lazz',1,1),
(233,'Flipstorm',1,1),
(234,'Skalith',1,1),
(235,'Browsebug',1,1),
(236,'Dabtype',1,1),
(237,'Edgetag',1,1),
(238,'Skidoo',1,1),
(239,'Flipbug',1,1),
(240,'Browsecat',1,1),
(241,'Gabspot',1,1),
(242,'Livefish',1,1),
(243,'Youfeed',1,1),
(244,'Thoughtsphere',1,1),
(245,'Tazzy',1,1),
(246,'Zooveo',1,1),
(247,'Muxo',1,1),
(248,'Feedbug',1,1),
(249,'Blogspan',1,1),
(250,'Devcast',1,1),
(251,'Katz',1,1),
(252,'Rhybox',1,1),
(253,'Livepath',1,1),
(254,'Flipbug',1,1),
(255,'Demimbu',1,1),
(256,'Livetube',1,1),
(257,'Twinte',1,1),
(258,'Nlounge',1,1),
(259,'Lazzy',1,1),
(260,'Gabspot',1,1),
(261,'Skyba',1,1),
(262,'Thoughtbridge',1,1),
(263,'Fadeo',1,1),
(264,'Dabtype',1,1),
(265,'Jaloo',1,1),
(266,'Pixonyx',1,1),
(267,'Meejo',1,1),
(268,'Snaptags',1,1),
(269,'Ntag',1,1),
(270,'Realcube',1,1),
(271,'Abata Boy',1,1),
(272,'Dabtype',1,1),
(273,'Muxo',1,1),
(274,'Meemm',1,1),
(275,'Devbug',1,1),
(276,'Viva',1,1),
(277,'Zoomcast',1,1),
(278,'Omba',1,1),
(279,'Twinder',1,1),
(280,'Demivee',1,1),
(281,'Skimia',1,1),
(282,'Ainyx',1,1),
(283,'Photobug',1,1),
(284,'Kazio',1,1),
(285,'Zoomlounge',1,1),
(286,'Twinte',1,1),
(287,'Lajo',1,1),
(288,'Vidoo',1,1),
(289,'Fadeo',1,1),
(290,'Kwilith',1,1),
(291,'Brainlounge',1,1),
(292,'Trilith',1,1),
(293,'Lazzy',1,1),
(294,'Ooba',1,1),
(295,'BlogXS',1,1),
(296,'Jabbersphere',1,1),
(297,'Demimbu',1,1),
(298,'Blognation',1,1),
(299,'Gigazoom',1,1),
(300,'Skajo',1,1),
(301,'Photofeed',1,1),
(302,'Topicblab',1,1),
(303,'Quimm',1,1),
(304,'Vinder',1,1),
(305,'Thoughtworks',1,1),
(306,'Dabfeed',1,1),
(307,'Meejo',1,1),
(308,'Meeveo',1,1),
(309,'Jabbersphere',1,1),
(310,'Yata',1,1),
(311,'Photolist',1,1),
(312,'Riffpedia',1,1),
(313,'Skyndu',1,1),
(314,'Photofeed',1,1),
(315,'Cogibox',1,1),
(316,'Vipe',1,1),
(317,'Wordpedia',1,1),
(318,'Kanoodle',1,1),
(319,'Avavee',1,1),
(320,'Oyope',1,1),
(321,'Meedoo',1,1),
(322,'Flashspan',1,1),
(323,'Oyonder',1,1),
(324,'Babblestorm',1,1),
(325,'Ntags',1,1),
(326,'Kazu',1,1),
(327,'Twitterbridge',1,1),
(328,'Jabberbean',1,1),
(329,'Devshare',1,1),
(330,'Jabbersphere',1,1),
(331,'Realpoint',1,1),
(332,'Topiczoom',1,1),
(333,'Avamm',1,1),
(334,'Zoomcast',1,1),
(335,'Oyonder',1,1),
(336,'Bluejam',1,1),
(337,'Yadel',1,1),
(338,'Linkbridge',1,1),
(339,'Fivechat',1,1),
(340,'Centimia',1,1),
(341,'Meezzy',1,1),
(342,'Ozu',1,1),
(343,'Quatz',1,1),
(344,'Feedspan',1,1),
(345,'Twitterbridge',1,1),
(346,'Skinder',1,1),
(347,'Skidoo',1,1),
(348,'Zoombox',1,1),
(349,'Quinu',1,1),
(350,'Trudeo',1,1),
(351,'Demivee',1,1),
(352,'Podcat',1,1),
(353,'Brainsphere',1,1),
(354,'Oyondu',1,1),
(355,'Katz',1,1),
(356,'Voolith',1,1),
(357,'Jabbersphere',1,1),
(358,'Realmix',1,1),
(359,'Trudeo',1,1),
(360,'All Saints',1,1),
(361,'Blognation',1,1),
(362,'Skimia',1,1),
(363,'Demivee',1,1),
(364,'Voonte',1,1),
(365,'Zoomdog',1,1),
(366,'Edgeclub',1,1),
(367,'Edgeify',1,1),
(368,'Riffwire',1,1),
(369,'Tanoodle',1,1),
(370,'Rooxo',1,1),
(371,'Yakijo',1,1),
(372,'Browseblab',1,1),
(373,'Dabshots',1,1),
(374,'Meeveo',1,1),
(375,'Realmix',1,1),
(376,'Twimm',1,1),
(377,'Digitube',1,1),
(378,'Photospace',1,1),
(379,'Photolist',1,1),
(380,'Avamba',1,1),
(381,'Devbug',1,1),
(382,'Mymm',1,1),
(383,'Skibox',1,1),
(384,'Muxo',1,1),
(385,'Eayo',1,1),
(386,'Meejo',1,1),
(387,'Topicblab',1,1),
(388,'Oba',1,1),
(389,'Mydeo',1,1),
(390,'Photobug',1,1),
(391,'Yoveo',1,1),
(392,'Wikizz',1,1),
(393,'Wordtune',1,1),
(394,'Jaloo',1,1),
(395,'Meevee',1,1),
(396,'Katz',1,1),
(397,'Blogtags',1,1),
(398,'Riffwire',1,1),
(399,'Eimbee',1,1),
(400,'Edgeify',1,1),
(401,'Thoughtworks',1,1),
(402,'Buzzdog',1,1),
(403,'Wikido',1,1),
(404,'Tagcat',1,1),
(405,'Skiptube',1,1),
(406,'Voonte',1,1),
(407,'Meemm',1,1),
(408,'Jaxnation',1,1),
(409,'Voolith',1,1),
(410,'Kare',1,1),
(411,'Buzzster',1,1),
(412,'Roombo',1,1),
(413,'Edgetag',1,1),
(414,'Kwinu',1,1),
(415,'Yozio',1,1),
(416,'Kamba',1,1),
(417,'BlogXS',1,1),
(418,'Topicware',1,1),
(419,'Vipe',1,1),
(420,'Kwinu',1,1),
(421,'Digitube',1,1),
(422,'Yotz',1,1),
(423,'Topiczoom',1,1),
(424,'Tazz',1,1),
(425,'Edgeify',1,1),
(426,'Browsebug',1,1),
(427,'Skyble',1,1),
(428,'Vitz',1,1),
(429,'Meetz',1,1),
(430,'Camimbo',1,1),
(431,'Realfire',1,1),
(432,'Yotz',1,1),
(433,'Photobean',1,1),
(434,'Camido',1,1),
(435,'Zazio',1,1),
(436,'Blogpad',1,1),
(437,'Viva',1,1),
(438,'Zava',1,1),
(439,'Wikizz',1,1),
(440,'Pixoboo',1,1),
(441,'Flipstorm',1,1),
(442,'Eazzy',1,1),
(443,'Zava',1,1),
(444,'Bubblemix',1,1),
(445,'Trilith',1,1),
(446,'Cogilith',1,1),
(447,'Oyonder',1,1),
(448,'InnoZ',1,1),
(449,'Lazz',1,1),
(450,'Livepath',1,1),
(451,'Lazzy',1,1),
(452,'Flashpoint',1,1),
(453,'Voonder',1,1),
(454,'Atari',1,1),
(455,'Oodoo',1,1),
(456,'Fliptune',1,1),
(457,'Pixoboo',1,1),
(458,'Thoughtsphere',1,1),
(459,'Aivee',1,1),
(460,'Trudoo',1,1),
(461,'Fivespan',1,1),
(462,'Linklinks',1,1),
(463,'Innojam',1,1),
(464,'Youspan',1,1),
(465,'Avavee',1,1),
(466,'Browsezoom',1,1),
(467,'Topicblab',1,1),
(468,'Mudo',1,1),
(469,'Yambee',1,1),
(470,'Trilith',1,1),
(471,'Tanoodle',1,1),
(472,'Voolia',1,1),
(473,'Kwimbee',1,1),
(474,'Thoughtblab',1,1),
(475,'Kwideo',1,1),
(476,'Gabtune',1,1),
(477,'Tagcat',1,1),
(478,'Gigazoom',1,1),
(479,'Skidoo',1,1),
(480,'Reallinks',1,1),
(481,'Feedfire',1,1),
(482,'Dabjam',1,1),
(483,'Skiptube',1,1),
(484,'Flipbug',1,1),
(485,'Voonder',1,1),
(486,'Realbuzz',1,1),
(487,'Thoughtstorm',1,1),
(488,'Aimbu',1,1),
(489,'Yabox',1,1),
(490,'Twitterbridge',1,1),
(491,'Brainlounge',1,1),
(492,'Latz',1,1),
(493,'Bubbletube',1,1),
(494,'Photobug',1,1),
(495,'Skipfire',1,1),
(496,'Able Acorn',2,2),
(497,'Photobug',1,1),
(498,'Topicware',1,1),
(499,'Kimia',1,1),
(500,'Minyx',1,1),
(501,'Devshare',1,1),
(502,'Edgepulse',1,1),
(503,'Devpoint',1,1),
(504,'Eazzy',1,1),
(505,'Buzzster',1,1),
(506,'Demivee',1,1),
(507,'Skyvu',1,1),
(508,'Dabvine',1,1),
(509,'Jabberstorm',1,1),
(510,'Meemm',1,1),
(511,'Edgetag',1,1),
(512,'Pixope',1,1),
(513,'Twinte',1,1),
(514,'Yadel',1,1),
(515,'Thoughtblab',1,1),
(516,'Tambee',1,1),
(517,'Jamia',1,1),
(518,'Jazzy',1,1),
(519,'Yadel',1,1),
(520,'Quatz',1,1),
(521,'Avamba',1,1),
(522,'Jaxworks',1,1),
(523,'Riffwire',1,1),
(524,'Kwilith',1,1),
(525,'Thoughtbridge',1,1),
(526,'Camido',1,1),
(527,'Gabspot',1,1),
(528,'Gabtune',1,1),
(529,'Vinder',1,1),
(530,'Mydo',1,1),
(531,'Fivespan',1,1),
(532,'Aimbu',1,1),
(533,'Jaxspan',1,1),
(534,'Miboo',1,1),
(535,'Youspan',1,1),
(536,'Centimia',1,1),
(537,'Miboo',1,1),
(538,'Jaxspan',1,1),
(539,'Vimbo',1,1),
(540,'Thoughtworks',1,1),
(541,'Tagfeed',1,1),
(542,'Eimbee',1,1),
(543,'Teklist',1,1),
(544,'Livetube',1,1),
(545,'Myworks',1,1),
(546,'Yombu',1,1),
(547,'Topicware',1,1),
(548,'Aimbo',1,1),
(549,'Feedmix',1,1),
(550,'Ntag',1,1),
(551,'Realpoint',1,1),
(552,'Voolia',1,1),
(553,'Miboo',1,1),
(554,'Yodoo',1,1),
(555,'Thoughtstorm',1,1),
(556,'Lazzy',1,1),
(557,'Wikibox',1,1),
(558,'Roodel',1,1),
(559,'Kwideo',1,1),
(560,'Aivee',1,1),
(561,'Camimbo',1,1),
(562,'Realcube',1,1),
(563,'DabZ',1,1),
(564,'Avaveo',1,1),
(565,'Yodoo',1,1),
(566,'Mybuzz',1,1),
(567,'Oloo',1,1),
(568,'Jaxworks',1,1),
(569,'Gabtune',1,1),
(570,'Bluezoom',1,1),
(571,'Thoughtstorm',1,1),
(572,'Topiclounge',1,1),
(573,'Camimbo',1,1),
(574,'Fliptune',1,1),
(575,'Linklinks',1,1),
(576,'Fadeo',1,1),
(577,'Browseblab',1,1),
(578,'Photofeed',1,1),
(579,'Mydeo',1,1),
(580,'Bubbletube',1,1),
(581,'Demizz',1,1),
(582,'Flipstorm',1,1),
(583,'Realcube',1,1),
(584,'Jabbertype',1,1),
(585,'Fadeo',1,1),
(586,'Eadel',1,1),
(587,'Mymm',1,1),
(588,'Voolith',1,1),
(589,'Photospace',1,1),
(590,'Yadel',1,1),
(591,'Mudo',1,1),
(592,'Browsedrive',1,1),
(593,'Eadel',1,1),
(594,'Thoughtstorm',1,1),
(595,'Bubblemix',1,1),
(596,'Nlounge',1,1),
(597,'Brainverse',1,1),
(598,'Acorn',1,1),
(599,'Reallinks',1,1),
(600,'Roodel',1,1),
(601,'Zoomcast',1,1),
(602,'Photojam',1,1),
(603,'Yambee',1,1),
(604,'Mynte',1,1),
(605,'Kwilith',1,1),
(606,'Eazzy',1,1),
(607,'Gigashots',1,1),
(608,'Vimbo',1,1),
(609,'Photolist',1,1),
(610,'Kimia',1,1),
(611,'Plambee',1,1),
(612,'Quamba',1,1),
(613,'Riffwire',1,1),
(614,'Kwinu',1,1),
(615,'Brightbean',1,1),
(616,'Wikido',1,1),
(617,'Mynte',1,1),
(618,'Skivee',1,1),
(619,'Trilith',1,1),
(620,'Aibox',1,1),
(621,'Gigazoom',1,1),
(622,'Abatz',1,1),
(623,'Feedfire',1,1),
(624,'Jazzy',1,1),
(625,'Feedmix',1,1),
(626,'Browsezoom',1,1),
(627,'Twitterbeat',1,1),
(628,'Avamba',1,1),
(629,'Jamia',1,1),
(630,'Dynabox',1,1),
(631,'Skimia',1,1),
(632,'Zoozzy',1,1),
(633,'Rhycero',1,1),
(634,'Browsedrive',1,1),
(635,'Kanoodle',1,1),
(636,'Plambee',1,1),
(637,'Meembee',1,1),
(638,'Brainlounge',1,1),
(639,'Jabbercube',1,1),
(640,'Fanoodle',1,1),
(641,'Gabtune',1,1),
(642,'Thoughtstorm',1,1),
(643,'Dazzlesphere',1,1),
(644,'Twitterbeat',1,1),
(645,'Dablist',1,1),
(646,'Fivebridge',1,1),
(647,'Kare',1,1),
(648,'Meeveo',1,1),
(649,'Trunyx',1,1),
(650,'Podcat',1,1),
(651,'Quimm',1,1),
(652,'Ntags',1,1),
(653,'Oyope',1,1),
(654,'Innojam',1,1),
(655,'Blogtag',1,1),
(656,'Zooxo',1,1),
(657,'Trudeo',1,1),
(658,'Twitternation',1,1),
(659,'Skimia',1,1),
(660,'Oba',1,1),
(661,'Blogpad',1,1),
(662,'Plajo',1,1),
(663,'Vimbo',1,1),
(664,'Topdrive',1,1),
(665,'Tazzy',1,1),
(666,'Oodoo',1,1),
(667,'Skippad',1,1),
(668,'Shuffletag',1,1),
(669,'Twitterbridge',1,1),
(670,'Thoughtworks',1,1),
(671,'Jaxbean',1,1),
(672,'Yombu',1,1),
(673,'Twinte',1,1),
(674,'Edgeify',1,1),
(675,'Eayo',1,1),
(676,'Gabtype',1,1),
(677,'Avaveo',1,1),
(678,'Meetz',1,1),
(679,'Youspan',1,1),
(680,'Leexo',1,1),
(681,'Skaboo',1,1),
(682,'Cogilith',1,1),
(683,'Yodoo',1,1),
(684,'Yozio',1,1),
(685,'Skajo',1,1),
(686,'Plambee',1,1),
(687,'Avaveo',1,1),
(688,'Photojam',1,1),
(689,'Gigashots',1,1),
(690,'Dynabox',1,1),
(691,'Demivee',1,1),
(692,'Realcube',1,1),
(693,'Twitterbridge',1,1),
(694,'Flashdog',1,1),
(695,'Centimia',1,1),
(696,'Quire',1,1),
(697,'Skimia',1,1),
(698,'Topicstorm',1,1),
(699,'Ainyx',1,1),
(700,'Voonyx',1,1),
(701,'Yodel',1,1),
(702,'Babbleopia',1,1),
(703,'Dabshots',1,1),
(704,'Muxo',1,1),
(705,'Divanoodle',1,1),
(706,'Quatz',1,1),
(707,'Dabjam',1,1),
(708,'Fadeo',1,1),
(709,'Kare',1,1),
(710,'Shuffledrive',1,1),
(711,'Avamba',1,1),
(712,'Yata',1,1),
(713,'Yakijo',1,1),
(714,'Brainlounge',1,1),
(715,'Youspan',1,1),
(716,'Yombu',1,1),
(717,'Twitterlist',1,1),
(718,'Youtags',1,1),
(719,'Demimbu',1,1),
(720,'Devpoint',1,1),
(721,'Photobean',1,1),
(722,'Dabshots',1,1),
(723,'Brainbox',1,1),
(724,'Devpulse',1,1),
(725,'Vipe',1,1),
(726,'Feedmix',1,1),
(727,'Devshare',1,1),
(728,'Centidel',1,1),
(729,'Thoughtstorm',1,1),
(730,'Lazz',1,1),
(731,'Tazzy',1,1),
(732,'Edgepulse',1,1),
(733,'Edgewire',1,1),
(734,'Quatz',1,1),
(735,'Zoonoodle',1,1),
(736,'Kimia',1,1),
(737,'Topdrive',1,1),
(738,'Trudeo',1,1),
(739,'Shuffletag',1,1),
(740,'Vinder',1,1),
(741,'Skinix',1,1),
(742,'Youspan',1,1),
(743,'Realcube',1,1),
(744,'Oba',1,1),
(745,'Voonyx',1,1),
(746,'Skiptube',1,1),
(747,'Blogpad',1,1),
(748,'Jaloo',1,1),
(749,'Talane',1,1),
(750,'Wikido',1,1),
(751,'Blognation',1,1),
(752,'Photobug',1,1),
(753,'Linkbridge',1,1),
(754,'Youopia',1,1),
(755,'Centizu',1,1),
(756,'Mita',1,1),
(757,'Skinix',1,1),
(758,'Wikibox',1,1),
(759,'Yata',1,1),
(760,'Dabvine',1,1),
(761,'Tagopia',1,1),
(762,'JumpXS',1,1),
(763,'Camido',1,1),
(764,'Demimbu',1,1),
(765,'Eadel',1,1),
(766,'Wikivu',1,1),
(767,'Topicware',1,1),
(768,'Jabberbean',1,1),
(769,'Demimbu',1,1),
(770,'Twitterbridge',1,1),
(771,'Topiczoom',1,1),
(772,'Viva',1,1),
(773,'Twitternation',1,1),
(774,'Fivebridge',1,1),
(775,'Voomm',1,1),
(776,'Shuffledrive',1,1),
(777,'Dynabox',1,1),
(778,'Rooxo',1,1),
(779,'Trilith',1,1),
(780,'Livefish',1,1),
(781,'Twitterworks',1,1),
(782,'Chatterbridge',1,1),
(783,'Tazz',1,1),
(784,'Roombo',1,1),
(785,'Bubblebox',1,1),
(786,'Divanoodle',1,1),
(787,'Fiveclub',1,1),
(788,'Mycat',1,1),
(789,'Jabbersphere',1,1),
(790,'Aged Cheddar',1,1),
(791,'Dablist',1,1),
(792,'Fatz',1,1),
(793,'Fivebridge',1,1),
(794,'Eidel',1,1),
(795,'Zoomlounge',1,1),
(796,'Wikivu',1,1),
(797,'Twitterbridge',1,1),
(798,'Gabtype',1,1),
(799,'Skivee',1,1),
(800,'Kwideo',1,1),
(801,'Kazu',1,1),
(802,'Photofeed',1,1),
(803,'Tagchat',1,1),
(804,'Topicblab',1,1),
(805,'Oyoyo',1,1),
(806,'Eayo',1,1),
(807,'Browsetype',1,1),
(808,'Flashdog',1,1),
(809,'Innojam',1,1),
(810,'Babbleset',1,1),
(811,'Rhycero',1,1),
(812,'Meetz',1,1),
(813,'Livetube',1,1),
(814,'Yakitri',1,1),
(815,'Meevee',1,1),
(816,'InnoZ',1,1),
(817,'Kwilith',1,1),
(818,'Trupe',1,1),
(819,'Skivee',1,1),
(820,'Tazz',1,1),
(821,'Voomm',1,1),
(822,'Viva',1,1),
(823,'Yombu',1,1),
(824,'Riffwire',1,1),
(825,'Rhyloo',1,1),
(826,'Podcat',1,1),
(827,'Skalith',1,1),
(828,'Aivee',1,1),
(829,'Zoombeat',1,1),
(830,'Tazzy',1,1),
(831,'Jayo',1,1),
(832,'Mybuzz',1,1),
(833,'Kwimbee',1,1),
(834,'Eimbee',1,1),
(835,'Oyondu',1,1),
(836,'Cogibox',1,1),
(837,'Kwimbee',1,1),
(838,'Feedfish',1,1),
(839,'Quinu',1,1),
(840,'Skimia',1,1),
(841,'Browsetype',1,1),
(842,'Gabspot',1,1),
(843,'Devify',1,1),
(844,'Miboo',1,1),
(845,'Brainbox',1,1),
(846,'Omba',1,1),
(847,'Browsetype',1,1),
(848,'Skynoodle',1,1),
(849,'Twimbo',1,1),
(850,'Demizz',1,1),
(851,'Plajo',1,1),
(852,'Roombo',1,1),
(853,'Fiveclub',1,1),
(854,'Voonyx',1,1),
(855,'Twimbo',1,1),
(856,'Mita',1,1),
(857,'Blogpad',1,1),
(858,'Eire',1,1),
(859,'Vidoo',1,1),
(860,'Gabspot',1,1),
(861,'Quinu',1,1),
(862,'Dynabox',1,1),
(863,'Plambee',1,1),
(864,'Abbott',1,1),
(865,'Jatri',1,1),
(866,'Meezzy',1,1),
(867,'Twitterworks',1,1),
(868,'Youspan',1,1),
(869,'Wikivu',1,1),
(870,'Photobean',1,1),
(871,'Brightdog',1,1),
(872,'Riffpedia',1,1),
(873,'Skipfire',1,1),
(874,'Kayveo',1,1),
(875,'Skajo',1,1),
(876,'Eire',1,1),
(877,'Avamm',1,1),
(878,'Meeveo',1,1),
(879,'Livetube',1,1),
(880,'Skalith',1,1),
(881,'Photojam',1,1),
(882,'Aimbu',1,1),
(883,'Quatz',1,1),
(884,'Bubbletube',1,1),
(885,'Talane',1,1),
(886,'Blogtags',1,1),
(887,'Feedfire',1,1),
(888,'Bluezoom',1,1),
(889,'Thoughtbridge',1,1),
(890,'Edgepulse',1,1),
(891,'Livefish',1,1),
(892,'Bubblemix',1,1),
(893,'Centimia',1,1),
(894,'Flashpoint',1,1),
(895,'Gabvine',1,1),
(896,'Jabbersphere',1,1),
(897,'Youopia',1,1),
(898,'Mynte',1,1),
(899,'Thoughtmix',1,1),
(900,'Brainverse',1,1),
(901,'Yodel',1,1),
(902,'Yakidoo',1,1),
(903,'Yotz',1,1),
(904,'Wikizz',1,1),
(905,'Skyba',1,1),
(906,'Teklist',1,1),
(907,'Voonte',1,1),
(908,'Realfire',1,1),
(909,'Feedfire',1,1),
(910,'Photojam',1,1),
(911,'LiveZ',1,1),
(912,'Skibox',1,1),
(913,'Skimia',1,1),
(914,'Zooveo',1,1),
(915,'Meetz',1,1),
(916,'Shuffledrive',1,1),
(917,'Zoovu',1,1),
(918,'Yozio',1,1),
(919,'Dynabox',1,1),
(920,'Cogilith',1,1),
(921,'Tavu',1,1),
(922,'Talane',1,1),
(923,'Jazzy',1,1),
(924,'Browsezoom',1,1),
(925,'Flashset',1,1),
(926,'Vinder',1,1),
(927,'Zooveo',1,1),
(928,'InnoZ',1,1),
(929,'Quire',1,1),
(930,'Leenti',1,1),
(931,'Centidel',1,1),
(932,'Twitterwire',1,1),
(933,'Brainverse',1,1),
(934,'Eire',1,1),
(935,'Twinte',1,1),
(936,'Yakidoo',1,1),
(937,'Photofeed',1,1),
(938,'Jabbersphere',1,1),
(939,'Muxo',1,1),
(940,'Livetube',1,1),
(941,'Quimba',1,1),
(942,'Podcat',1,1),
(943,'Tagpad',1,1),
(944,'Chatterpoint',1,1),
(945,'Innotype',1,1),
(946,'Jetwire',1,1),
(947,'Kwimbee',1,1),
(948,'Kazu',1,1),
(949,'Centidel',1,1),
(950,'Vidoo',1,1),
(951,'Skajo',1,1),
(952,'Avamba',1,1),
(953,'Eayo',1,1),
(954,'Skiba',1,1),
(955,'Camido',1,1),
(956,'Geba',1,1),
(957,'Skinix',1,1),
(958,'Minyx',1,1),
(959,'Jaxspan',1,1),
(960,'Yabox',1,1),
(961,'Twimbo',1,1),
(962,'Zooveo',1,1),
(963,'Skipfire',1,1),
(964,'Zoomlounge',1,1),
(965,'Talane',1,1),
(966,'Omba',1,1),
(967,'JumpXS',1,1),
(968,'Meetz',1,1),
(969,'Feedfire',1,1),
(970,'Gigabox',1,1),
(971,'Agivu Corp.',1,1),
(972,'Youtags',1,1),
(973,'Talane',1,1),
(974,'Eimbee',1,1),
(975,'Skimia',1,1),
(976,'Jaxnation',1,1),
(977,'Zoomcast',1,1),
(978,'Edgeclub',1,1),
(979,'Latz',1,1),
(980,'Youspan',1,1),
(981,'Flipbug',1,1),
(982,'Fadeo',1,1),
(983,'Babblestorm',1,1),
(984,'Eamia',1,1),
(985,'Ailane',1,1),
(986,'Avamm',1,1),
(987,'Trupe',1,1),
(988,'Kwideo',1,1),
(989,'Jaxbean',1,1),
(990,'Yodel',1,1),
(991,'Skivee',1,1),
(992,'Photospace',1,1),
(993,'Devify',1,1),
(994,'Livepath',1,1),
(995,'Nlounge',1,1),
(996,'Katz',1,1),
(997,'Twimm',1,1),
(998,'Blogtags',1,1),
(999,'Teklist',1,1),
(1000,'Yotz',1,1)
	 ) AS Source ( [Id], [Name], [StatusID], [SourceId] )
ON ( Target.[Id] = Source.[Id] )
WHEN MATCHED AND ( NULLIF(Source.[Name], Target.[Name]) IS NOT NULL
				   OR NULLIF(Target.[Name], Source.[Name]) IS NOT NULL
				   OR NULLIF(Source.[StatusID], Target.[StatusID]) IS NOT NULL
				   OR NULLIF(Target.[StatusID], Source.[StatusID]) IS NOT NULL
				   OR NULLIF(Source.[SourceId], Target.[SourceId]) IS NOT NULL
				   OR NULLIF(Target.[SourceId], Source.[SourceId]) IS NOT NULL
				 ) THEN
	UPDATE SET [Name] = Source.[Name] ,
			   [StatusID] = Source.[StatusID],
			   [SourceId] = Source.SourceId
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [Id] ,
			 [Name] ,
			 [StatusID] ,
			 [SourceId]
		   )
	VALUES ( Source.[Id] ,
			 Source.[Name] ,
			 Source.[StatusID] ,
			 Source.[SourceId]
		   );
SET IDENTITY_INSERT Customers OFF;

-- Customer Addresses
MERGE INTO [CustomerAddresses] AS Target
USING ( VALUES
    ( 1 , 1 , 1)
 ,  ( 2 , 2 , 1)
 ,  ( 3 , 3 , 1)
 ,  ( 4 , 4 , 1)
 ,  ( 5 , 5 , 1)
 ,  ( 6 , 6 , 1)
 ,  ( 7 , 7 , 1)
 ,  ( 8 , 8 , 1)
 ,  ( 9 , 9 , 1)
 ,  ( 10 , 10 , 1)
 ,  ( 11 , 11 , 1)
 ,  ( 12 , 12 , 1)
 ,  ( 13 , 13 , 1)
 ,  ( 14 , 14 , 1)
 ,  ( 15 , 15 , 1)
 ,  ( 16 , 16 , 1)
 ,  ( 17 , 17 , 1)
 ,  ( 18 , 18 , 1)
 ,  ( 19 , 19 , 1)
 ,  ( 20 , 20 , 1)
 ,  ( 21 , 21 , 1)
 ,  ( 22 , 22 , 1)
 ,  ( 23 , 23 , 1)
 ,  ( 24 , 24 , 1)
 ,  ( 25 , 25 , 1)
 ,  ( 26 , 26 , 1)
 ,  ( 27 , 27 , 1)
 ,  ( 28 , 28 , 1)
 ,  ( 29 , 29 , 1)
 ,  ( 30 , 30 , 1)
 ,  ( 31 , 31 , 1)
 ,  ( 32 , 32 , 1)
 ,  ( 33 , 33 , 1)
 ,  ( 34 , 34 , 1)
 ,  ( 35 , 35 , 1)
 ,  ( 36 , 36 , 1)
 ,  ( 37 , 37 , 1)
 ,  ( 38 , 38 , 1)
 ,  ( 39 , 39 , 1)
 ,  ( 40 , 40 , 1)
 ,  ( 41 , 41 , 1)
 ,  ( 42 , 42 , 1)
 ,  ( 43 , 43 , 1)
 ,  ( 44 , 44 , 1)
 ,  ( 45 , 45 , 1)
 ,  ( 46 , 46 , 1)
 ,  ( 47 , 47 , 1)
 ,  ( 48 , 48 , 1)
 ,  ( 49 , 49 , 1)
 ,  ( 50 , 50 , 1)
 ,  ( 51 , 51 , 1)
 ,  ( 52 , 52 , 1)
 ,  ( 53 , 53 , 1)
 ,  ( 54 , 54 , 1)
 ,  ( 55 , 55 , 1)
 ,  ( 56 , 56 , 1)
 ,  ( 57 , 57 , 1)
 ,  ( 58 , 58 , 1)
 ,  ( 59 , 59 , 1)
 ,  ( 60 , 60 , 1)
 ,  ( 61 , 61 , 1)
 ,  ( 62 , 62 , 1)
 ,  ( 63 , 63 , 1)
 ,  ( 64 , 64 , 1)
 ,  ( 65 , 65 , 1)
 ,  ( 66 , 66 , 1)
 ,  ( 67 , 67 , 1)
 ,  ( 68 , 68 , 1)
 ,  ( 69 , 69 , 1)
 ,  ( 70 , 70 , 1)
 ,  ( 71 , 71 , 1)
 ,  ( 72 , 72 , 1)
 ,  ( 73 , 73 , 1)
 ,  ( 74 , 74 , 1)
 ,  ( 75 , 75 , 1)
 ,  ( 76 , 76 , 1)
 ,  ( 77 , 77 , 1)
 ,  ( 78 , 78 , 1)
 ,  ( 79 , 79 , 1)
 ,  ( 80 , 80 , 1)
 ,  ( 81 , 81 , 1)
 ,  ( 82 , 82 , 1)
 ,  ( 83 , 83 , 1)
 ,  ( 84 , 84 , 1)
 ,  ( 85 , 85 , 1)
 ,  ( 86 , 86 , 1)
 ,  ( 87 , 87 , 1)
 ,  ( 88 , 88 , 1)
 ,  ( 89 , 89 , 1)
 ,  ( 90 , 90 , 1)
 ,  ( 91 , 91 , 1)
 ,  ( 92 , 92 , 1)
 ,  ( 93 , 93 , 1)
 ,  ( 94 , 94 , 1)
 ,  ( 95 , 95 , 1)
 ,  ( 96 , 96 , 1)
 ,  ( 97 , 97 , 1)
 ,  ( 98 , 98 , 1)
 ,  ( 99 , 99 , 1)
 ,  ( 100 , 100 , 1)
 ,  ( 101 , 101 , 1)
 ,  ( 102 , 102 , 1)
 ,  ( 103 , 103 , 1)
 ,  ( 104 , 104 , 1)
 ,  ( 105 , 105 , 1)
 ,  ( 106 , 106 , 1)
 ,  ( 107 , 107 , 1)
 ,  ( 108 , 108 , 1)
 ,  ( 109 , 109 , 1)
 ,  ( 110 , 110 , 1)
 ,  ( 111 , 111 , 1)
 ,  ( 112 , 112 , 1)
 ,  ( 113 , 113 , 1)
 ,  ( 114 , 114 , 1)
 ,  ( 115 , 115 , 1)
 ,  ( 116 , 116 , 1)
 ,  ( 117 , 117 , 1)
 ,  ( 118 , 118 , 1)
 ,  ( 119 , 119 , 1)
 ,  ( 120 , 120 , 1)
 ,  ( 121 , 121 , 1)
 ,  ( 122 , 122 , 1)
 ,  ( 123 , 123 , 1)
 ,  ( 124 , 124 , 1)
 ,  ( 125 , 125 , 1)
 ,  ( 126 , 126 , 1)
 ,  ( 127 , 127 , 1)
 ,  ( 128 , 128 , 1)
 ,  ( 129 , 129 , 1)
 ,  ( 130 , 130 , 1)
 ,  ( 131 , 131 , 1)
 ,  ( 132 , 132 , 1)
 ,  ( 133 , 133 , 1)
 ,  ( 134 , 134 , 1)
 ,  ( 135 , 135 , 1)
 ,  ( 136 , 136 , 1)
 ,  ( 137 , 137 , 1)
 ,  ( 138 , 138 , 1)
 ,  ( 139 , 139 , 1)
 ,  ( 140 , 140 , 1)
 ,  ( 141 , 141 , 1)
 ,  ( 142 , 142 , 1)
 ,  ( 143 , 143 , 1)
 ,  ( 144 , 144 , 1)
 ,  ( 145 , 145 , 1)
 ,  ( 146 , 146 , 1)
 ,  ( 147 , 147 , 1)
 ,  ( 148 , 148 , 1)
 ,  ( 149 , 149 , 1)
 ,  ( 150 , 150 , 1)
 ,  ( 151 , 151 , 1)
 ,  ( 152 , 152 , 1)
 ,  ( 153 , 153 , 1)
 ,  ( 154 , 154 , 1)
 ,  ( 155 , 155 , 1)
 ,  ( 156 , 156 , 1)
 ,  ( 157 , 157 , 1)
 ,  ( 158 , 158 , 1)
 ,  ( 159 , 159 , 1)
 ,  ( 160 , 160 , 1)
 ,  ( 161 , 161 , 1)
 ,  ( 162 , 162 , 1)
 ,  ( 163 , 163 , 1)
 ,  ( 164 , 164 , 1)
 ,  ( 165 , 165 , 1)
 ,  ( 166 , 166 , 1)
 ,  ( 167 , 167 , 1)
 ,  ( 168 , 168 , 1)
 ,  ( 169 , 169 , 1)
 ,  ( 170 , 170 , 1)
 ,  ( 171 , 171 , 1)
 ,  ( 172 , 172 , 1)
 ,  ( 173 , 173 , 1)
 ,  ( 174 , 174 , 1)
 ,  ( 175 , 175 , 1)
 ,  ( 176 , 176 , 1)
 ,  ( 177 , 177 , 1)
 ,  ( 178 , 178 , 1)
 ,  ( 179 , 179 , 1)
 ,  ( 180 , 180 , 1)
 ,  ( 181 , 181 , 1)
 ,  ( 182 , 182 , 1)
 ,  ( 183 , 183 , 1)
 ,  ( 184 , 184 , 1)
 ,  ( 185 , 185 , 1)
 ,  ( 186 , 186 , 1)
 ,  ( 187 , 187 , 1)
 ,  ( 188 , 188 , 1)
 ,  ( 189 , 189 , 1)
 ,  ( 190 , 190 , 1)
 ,  ( 191 , 191 , 1)
 ,  ( 192 , 192 , 1)
 ,  ( 193 , 193 , 1)
 ,  ( 194 , 194 , 1)
 ,  ( 195 , 195 , 1)
 ,  ( 196 , 196 , 1)
 ,  ( 197 , 197 , 1)
 ,  ( 198 , 198 , 1)
 ,  ( 199 , 199 , 1)
 ,  ( 200 , 200 , 1)
 ,  ( 201 , 201 , 1)
 ,  ( 202 , 202 , 1)
 ,  ( 203 , 203 , 1)
 ,  ( 204 , 204 , 1)
 ,  ( 205 , 205 , 1)
 ,  ( 206 , 206 , 1)
 ,  ( 207 , 207 , 1)
 ,  ( 208 , 208 , 1)
 ,  ( 209 , 209 , 1)
 ,  ( 210 , 210 , 1)
 ,  ( 211 , 211 , 1)
 ,  ( 212 , 212 , 1)
 ,  ( 213 , 213 , 1)
 ,  ( 214 , 214 , 1)
 ,  ( 215 , 215 , 1)
 ,  ( 216 , 216 , 1)
 ,  ( 217 , 217 , 1)
 ,  ( 218 , 218 , 1)
 ,  ( 219 , 219 , 1)
 ,  ( 220 , 220 , 1)
 ,  ( 221 , 221 , 1)
 ,  ( 222 , 222 , 1)
 ,  ( 223 , 223 , 1)
 ,  ( 224 , 224 , 1)
 ,  ( 225 , 225 , 1)
 ,  ( 226 , 226 , 1)
 ,  ( 227 , 227 , 1)
 ,  ( 228 , 228 , 1)
 ,  ( 229 , 229 , 1)
 ,  ( 230 , 230 , 1)
 ,  ( 231 , 231 , 1)
 ,  ( 232 , 232 , 1)
 ,  ( 233 , 233 , 1)
 ,  ( 234 , 234 , 1)
 ,  ( 235 , 235 , 1)
 ,  ( 236 , 236 , 1)
 ,  ( 237 , 237 , 1)
 ,  ( 238 , 238 , 1)
 ,  ( 239 , 239 , 1)
 ,  ( 240 , 240 , 1)
 ,  ( 241 , 241 , 1)
 ,  ( 242 , 242 , 1)
 ,  ( 243 , 243 , 1)
 ,  ( 244 , 244 , 1)
 ,  ( 245 , 245 , 1)
 ,  ( 246 , 246 , 1)
 ,  ( 247 , 247 , 1)
 ,  ( 248 , 248 , 1)
 ,  ( 249 , 249 , 1)
 ,  ( 250 , 250 , 1)
 ,  ( 251 , 251 , 1)
 ,  ( 252 , 252 , 1)
 ,  ( 253 , 253 , 1)
 ,  ( 254 , 254 , 1)
 ,  ( 255 , 255 , 1)
 ,  ( 256 , 256 , 1)
 ,  ( 257 , 257 , 1)
 ,  ( 258 , 258 , 1)
 ,  ( 259 , 259 , 1)
 ,  ( 260 , 260 , 1)
 ,  ( 261 , 261 , 1)
 ,  ( 262 , 262 , 1)
 ,  ( 263 , 263 , 1)
 ,  ( 264 , 264 , 1)
 ,  ( 265 , 265 , 1)
 ,  ( 266 , 266 , 1)
 ,  ( 267 , 267 , 1)
 ,  ( 268 , 268 , 1)
 ,  ( 269 , 269 , 1)
 ,  ( 270 , 270 , 1)
 ,  ( 271 , 271 , 1)
 ,  ( 272 , 272 , 1)
 ,  ( 273 , 273 , 1)
 ,  ( 274 , 274 , 1)
 ,  ( 275 , 275 , 1)
 ,  ( 276 , 276 , 1)
 ,  ( 277 , 277 , 1)
 ,  ( 278 , 278 , 1)
 ,  ( 279 , 279 , 1)
 ,  ( 280 , 280 , 1)
 ,  ( 281 , 281 , 1)
 ,  ( 282 , 282 , 1)
 ,  ( 283 , 283 , 1)
 ,  ( 284 , 284 , 1)
 ,  ( 285 , 285 , 1)
 ,  ( 286 , 286 , 1)
 ,  ( 287 , 287 , 1)
 ,  ( 288 , 288 , 1)
 ,  ( 289 , 289 , 1)
 ,  ( 290 , 290 , 1)
 ,  ( 291 , 291 , 1)
 ,  ( 292 , 292 , 1)
 ,  ( 293 , 293 , 1)
 ,  ( 294 , 294 , 1)
 ,  ( 295 , 295 , 1)
 ,  ( 296 , 296 , 1)
 ,  ( 297 , 297 , 1)
 ,  ( 298 , 298 , 1)
 ,  ( 299 , 299 , 1)
 ,  ( 300 , 300 , 1)
 ,  ( 301 , 301 , 1)
 ,  ( 302 , 302 , 1)
 ,  ( 303 , 303 , 1)
 ,  ( 304 , 304 , 1)
 ,  ( 305 , 305 , 1)
 ,  ( 306 , 306 , 1)
 ,  ( 307 , 307 , 1)
 ,  ( 308 , 308 , 1)
 ,  ( 309 , 309 , 1)
 ,  ( 310 , 310 , 1)
 ,  ( 311 , 311 , 1)
 ,  ( 312 , 312 , 1)
 ,  ( 313 , 313 , 1)
 ,  ( 314 , 314 , 1)
 ,  ( 315 , 315 , 1)
 ,  ( 316 , 316 , 1)
 ,  ( 317 , 317 , 1)
 ,  ( 318 , 318 , 1)
 ,  ( 319 , 319 , 1)
 ,  ( 320 , 320 , 1)
 ,  ( 321 , 321 , 1)
 ,  ( 322 , 322 , 1)
 ,  ( 323 , 323 , 1)
 ,  ( 324 , 324 , 1)
 ,  ( 325 , 325 , 1)
 ,  ( 326 , 326 , 1)
 ,  ( 327 , 327 , 1)
 ,  ( 328 , 328 , 1)
 ,  ( 329 , 329 , 1)
 ,  ( 330 , 330 , 1)
 ,  ( 331 , 331 , 1)
 ,  ( 332 , 332 , 1)
 ,  ( 333 , 333 , 1)
 ,  ( 334 , 334 , 1)
 ,  ( 335 , 335 , 1)
 ,  ( 336 , 336 , 1)
 ,  ( 337 , 337 , 1)
 ,  ( 338 , 338 , 1)
 ,  ( 339 , 339 , 1)
 ,  ( 340 , 340 , 1)
 ,  ( 341 , 341 , 1)
 ,  ( 342 , 342 , 1)
 ,  ( 343 , 343 , 1)
 ,  ( 344 , 344 , 1)
 ,  ( 345 , 345 , 1)
 ,  ( 346 , 346 , 1)
 ,  ( 347 , 347 , 1)
 ,  ( 348 , 348 , 1)
 ,  ( 349 , 349 , 1)
 ,  ( 350 , 350 , 1)
 ,  ( 351 , 351 , 1)
 ,  ( 352 , 352 , 1)
 ,  ( 353 , 353 , 1)
 ,  ( 354 , 354 , 1)
 ,  ( 355 , 355 , 1)
 ,  ( 356 , 356 , 1)
 ,  ( 357 , 357 , 1)
 ,  ( 358 , 358 , 1)
 ,  ( 359 , 359 , 1)
 ,  ( 360 , 360 , 1)
 ,  ( 361 , 361 , 1)
 ,  ( 362 , 362 , 1)
 ,  ( 363 , 363 , 1)
 ,  ( 364 , 364 , 1)
 ,  ( 365 , 365 , 1)
 ,  ( 366 , 366 , 1)
 ,  ( 367 , 367 , 1)
 ,  ( 368 , 368 , 1)
 ,  ( 369 , 369 , 1)
 ,  ( 370 , 370 , 1)
 ,  ( 371 , 371 , 1)
 ,  ( 372 , 372 , 1)
 ,  ( 373 , 373 , 1)
 ,  ( 374 , 374 , 1)
 ,  ( 375 , 375 , 1)
 ,  ( 376 , 376 , 1)
 ,  ( 377 , 377 , 1)
 ,  ( 378 , 378 , 1)
 ,  ( 379 , 379 , 1)
 ,  ( 380 , 380 , 1)
 ,  ( 381 , 381 , 1)
 ,  ( 382 , 382 , 1)
 ,  ( 383 , 383 , 1)
 ,  ( 384 , 384 , 1)
 ,  ( 385 , 385 , 1)
 ,  ( 386 , 386 , 1)
 ,  ( 387 , 387 , 1)
 ,  ( 388 , 388 , 1)
 ,  ( 389 , 389 , 1)
 ,  ( 390 , 390 , 1)
 ,  ( 391 , 391 , 1)
 ,  ( 392 , 392 , 1)
 ,  ( 393 , 393 , 1)
 ,  ( 394 , 394 , 1)
 ,  ( 395 , 395 , 1)
 ,  ( 396 , 396 , 1)
 ,  ( 397 , 397 , 1)
 ,  ( 398 , 398 , 1)
 ,  ( 399 , 399 , 1)
 ,  ( 400 , 400 , 1)
 ,  ( 401 , 401 , 1)
 ,  ( 402 , 402 , 1)
 ,  ( 403 , 403 , 1)
 ,  ( 404 , 404 , 1)
 ,  ( 405 , 405 , 1)
 ,  ( 406 , 406 , 1)
 ,  ( 407 , 407 , 1)
 ,  ( 408 , 408 , 1)
 ,  ( 409 , 409 , 1)
 ,  ( 410 , 410 , 1)
 ,  ( 411 , 411 , 1)
 ,  ( 412 , 412 , 1)
 ,  ( 413 , 413 , 1)
 ,  ( 414 , 414 , 1)
 ,  ( 415 , 415 , 1)
 ,  ( 416 , 416 , 1)
 ,  ( 417 , 417 , 1)
 ,  ( 418 , 418 , 1)
 ,  ( 419 , 419 , 1)
 ,  ( 420 , 420 , 1)
 ,  ( 421 , 421 , 1)
 ,  ( 422 , 422 , 1)
 ,  ( 423 , 423 , 1)
 ,  ( 424 , 424 , 1)
 ,  ( 425 , 425 , 1)
 ,  ( 426 , 426 , 1)
 ,  ( 427 , 427 , 1)
 ,  ( 428 , 428 , 1)
 ,  ( 429 , 429 , 1)
 ,  ( 430 , 430 , 1)
 ,  ( 431 , 431 , 1)
 ,  ( 432 , 432 , 1)
 ,  ( 433 , 433 , 1)
 ,  ( 434 , 434 , 1)
 ,  ( 435 , 435 , 1)
 ,  ( 436 , 436 , 1)
 ,  ( 437 , 437 , 1)
 ,  ( 438 , 438 , 1)
 ,  ( 439 , 439 , 1)
 ,  ( 440 , 440 , 1)
 ,  ( 441 , 441 , 1)
 ,  ( 442 , 442 , 1)
 ,  ( 443 , 443 , 1)
 ,  ( 444 , 444 , 1)
 ,  ( 445 , 445 , 1)
 ,  ( 446 , 446 , 1)
 ,  ( 447 , 447 , 1)
 ,  ( 448 , 448 , 1)
 ,  ( 449 , 449 , 1)
 ,  ( 450 , 450 , 1)
 ,  ( 451 , 451 , 1)
 ,  ( 452 , 452 , 1)
 ,  ( 453 , 453 , 1)
 ,  ( 454 , 454 , 1)
 ,  ( 455 , 455 , 1)
 ,  ( 456 , 456 , 1)
 ,  ( 457 , 457 , 1)
 ,  ( 458 , 458 , 1)
 ,  ( 459 , 459 , 1)
 ,  ( 460 , 460 , 1)
 ,  ( 461 , 461 , 1)
 ,  ( 462 , 462 , 1)
 ,  ( 463 , 463 , 1)
 ,  ( 464 , 464 , 1)
 ,  ( 465 , 465 , 1)
 ,  ( 466 , 466 , 1)
 ,  ( 467 , 467 , 1)
 ,  ( 468 , 468 , 1)
 ,  ( 469 , 469 , 1)
 ,  ( 470 , 470 , 1)
 ,  ( 471 , 471 , 1)
 ,  ( 472 , 472 , 1)
 ,  ( 473 , 473 , 1)
 ,  ( 474 , 474 , 1)
 ,  ( 475 , 475 , 1)
 ,  ( 476 , 476 , 1)
 ,  ( 477 , 477 , 1)
 ,  ( 478 , 478 , 1)
 ,  ( 479 , 479 , 1)
 ,  ( 480 , 480 , 1)
 ,  ( 481 , 481 , 1)
 ,  ( 482 , 482 , 1)
 ,  ( 483 , 483 , 1)
 ,  ( 484 , 484 , 1)
 ,  ( 485 , 485 , 1)
 ,  ( 486 , 486 , 1)
 ,  ( 487 , 487 , 1)
 ,  ( 488 , 488 , 1)
 ,  ( 489 , 489 , 1)
 ,  ( 490 , 490 , 1)
 ,  ( 491 , 491 , 1)
 ,  ( 492 , 492 , 1)
 ,  ( 493 , 493 , 1)
 ,  ( 494 , 494 , 1)
 ,  ( 495 , 495 , 1)
 ,  ( 496 , 496 , 1)
 ,  ( 497 , 497 , 1)
 ,  ( 498 , 498 , 1)
 ,  ( 499 , 499 , 1)
 ,  ( 500 , 500 , 1)
 ,  ( 501 , 501 , 1)
 ,  ( 502 , 502 , 1)
 ,  ( 503 , 503 , 1)
 ,  ( 504 , 504 , 1)
 ,  ( 505 , 505 , 1)
 ,  ( 506 , 506 , 1)
 ,  ( 507 , 507 , 1)
 ,  ( 508 , 508 , 1)
 ,  ( 509 , 509 , 1)
 ,  ( 510 , 510 , 1)
 ,  ( 511 , 511 , 1)
 ,  ( 512 , 512 , 1)
 ,  ( 513 , 513 , 1)
 ,  ( 514 , 514 , 1)
 ,  ( 515 , 515 , 1)
 ,  ( 516 , 516 , 1)
 ,  ( 517 , 517 , 1)
 ,  ( 518 , 518 , 1)
 ,  ( 519 , 519 , 1)
 ,  ( 520 , 520 , 1)
 ,  ( 521 , 521 , 1)
 ,  ( 522 , 522 , 1)
 ,  ( 523 , 523 , 1)
 ,  ( 524 , 524 , 1)
 ,  ( 525 , 525 , 1)
 ,  ( 526 , 526 , 1)
 ,  ( 527 , 527 , 1)
 ,  ( 528 , 528 , 1)
 ,  ( 529 , 529 , 1)
 ,  ( 530 , 530 , 1)
 ,  ( 531 , 531 , 1)
 ,  ( 532 , 532 , 1)
 ,  ( 533 , 533 , 1)
 ,  ( 534 , 534 , 1)
 ,  ( 535 , 535 , 1)
 ,  ( 536 , 536 , 1)
 ,  ( 537 , 537 , 1)
 ,  ( 538 , 538 , 1)
 ,  ( 539 , 539 , 1)
 ,  ( 540 , 540 , 1)
 ,  ( 541 , 541 , 1)
 ,  ( 542 , 542 , 1)
 ,  ( 543 , 543 , 1)
 ,  ( 544 , 544 , 1)
 ,  ( 545 , 545 , 1)
 ,  ( 546 , 546 , 1)
 ,  ( 547 , 547 , 1)
 ,  ( 548 , 548 , 1)
 ,  ( 549 , 549 , 1)
 ,  ( 550 , 550 , 1)
 ,  ( 551 , 551 , 1)
 ,  ( 552 , 552 , 1)
 ,  ( 553 , 553 , 1)
 ,  ( 554 , 554 , 1)
 ,  ( 555 , 555 , 1)
 ,  ( 556 , 556 , 1)
 ,  ( 557 , 557 , 1)
 ,  ( 558 , 558 , 1)
 ,  ( 559 , 559 , 1)
 ,  ( 560 , 560 , 1)
 ,  ( 561 , 561 , 1)
 ,  ( 562 , 562 , 1)
 ,  ( 563 , 563 , 1)
 ,  ( 564 , 564 , 1)
 ,  ( 565 , 565 , 1)
 ,  ( 566 , 566 , 1)
 ,  ( 567 , 567 , 1)
 ,  ( 568 , 568 , 1)
 ,  ( 569 , 569 , 1)
 ,  ( 570 , 570 , 1)
 ,  ( 571 , 571 , 1)
 ,  ( 572 , 572 , 1)
 ,  ( 573 , 573 , 1)
 ,  ( 574 , 574 , 1)
 ,  ( 575 , 575 , 1)
 ,  ( 576 , 576 , 1)
 ,  ( 577 , 577 , 1)
 ,  ( 578 , 578 , 1)
 ,  ( 579 , 579 , 1)
 ,  ( 580 , 580 , 1)
 ,  ( 581 , 581 , 1)
 ,  ( 582 , 582 , 1)
 ,  ( 583 , 583 , 1)
 ,  ( 584 , 584 , 1)
 ,  ( 585 , 585 , 1)
 ,  ( 586 , 586 , 1)
 ,  ( 587 , 587 , 1)
 ,  ( 588 , 588 , 1)
 ,  ( 589 , 589 , 1)
 ,  ( 590 , 590 , 1)
 ,  ( 591 , 591 , 1)
 ,  ( 592 , 592 , 1)
 ,  ( 593 , 593 , 1)
 ,  ( 594 , 594 , 1)
 ,  ( 595 , 595 , 1)
 ,  ( 596 , 596 , 1)
 ,  ( 597 , 597 , 1)
 ,  ( 598 , 598 , 1)
 ,  ( 599 , 599 , 1)
 ,  ( 600 , 600 , 1)
 ,  ( 601 , 601 , 1)
 ,  ( 602 , 602 , 1)
 ,  ( 603 , 603 , 1)
 ,  ( 604 , 604 , 1)
 ,  ( 605 , 605 , 1)
 ,  ( 606 , 606 , 1)
 ,  ( 607 , 607 , 1)
 ,  ( 608 , 608 , 1)
 ,  ( 609 , 609 , 1)
 ,  ( 610 , 610 , 1)
 ,  ( 611 , 611 , 1)
 ,  ( 612 , 612 , 1)
 ,  ( 613 , 613 , 1)
 ,  ( 614 , 614 , 1)
 ,  ( 615 , 615 , 1)
 ,  ( 616 , 616 , 1)
 ,  ( 617 , 617 , 1)
 ,  ( 618 , 618 , 1)
 ,  ( 619 , 619 , 1)
 ,  ( 620 , 620 , 1)
 ,  ( 621 , 621 , 1)
 ,  ( 622 , 622 , 1)
 ,  ( 623 , 623 , 1)
 ,  ( 624 , 624 , 1)
 ,  ( 625 , 625 , 1)
 ,  ( 626 , 626 , 1)
 ,  ( 627 , 627 , 1)
 ,  ( 628 , 628 , 1)
 ,  ( 629 , 629 , 1)
 ,  ( 630 , 630 , 1)
 ,  ( 631 , 631 , 1)
 ,  ( 632 , 632 , 1)
 ,  ( 633 , 633 , 1)
 ,  ( 634 , 634 , 1)
 ,  ( 635 , 635 , 1)
 ,  ( 636 , 636 , 1)
 ,  ( 637 , 637 , 1)
 ,  ( 638 , 638 , 1)
 ,  ( 639 , 639 , 1)
 ,  ( 640 , 640 , 1)
 ,  ( 641 , 641 , 1)
 ,  ( 642 , 642 , 1)
 ,  ( 643 , 643 , 1)
 ,  ( 644 , 644 , 1)
 ,  ( 645 , 645 , 1)
 ,  ( 646 , 646 , 1)
 ,  ( 647 , 647 , 1)
 ,  ( 648 , 648 , 1)
 ,  ( 649 , 649 , 1)
 ,  ( 650 , 650 , 1)
 ,  ( 651 , 651 , 1)
 ,  ( 652 , 652 , 1)
 ,  ( 653 , 653 , 1)
 ,  ( 654 , 654 , 1)
 ,  ( 655 , 655 , 1)
 ,  ( 656 , 656 , 1)
 ,  ( 657 , 657 , 1)
 ,  ( 658 , 658 , 1)
 ,  ( 659 , 659 , 1)
 ,  ( 660 , 660 , 1)
 ,  ( 661 , 661 , 1)
 ,  ( 662 , 662 , 1)
 ,  ( 663 , 663 , 1)
 ,  ( 664 , 664 , 1)
 ,  ( 665 , 665 , 1)
 ,  ( 666 , 666 , 1)
 ,  ( 667 , 667 , 1)
 ,  ( 668 , 668 , 1)
 ,  ( 669 , 669 , 1)
 ,  ( 670 , 670 , 1)
 ,  ( 671 , 671 , 1)
 ,  ( 672 , 672 , 1)
 ,  ( 673 , 673 , 1)
 ,  ( 674 , 674 , 1)
 ,  ( 675 , 675 , 1)
 ,  ( 676 , 676 , 1)
 ,  ( 677 , 677 , 1)
 ,  ( 678 , 678 , 1)
 ,  ( 679 , 679 , 1)
 ,  ( 680 , 680 , 1)
 ,  ( 681 , 681 , 1)
 ,  ( 682 , 682 , 1)
 ,  ( 683 , 683 , 1)
 ,  ( 684 , 684 , 1)
 ,  ( 685 , 685 , 1)
 ,  ( 686 , 686 , 1)
 ,  ( 687 , 687 , 1)
 ,  ( 688 , 688 , 1)
 ,  ( 689 , 689 , 1)
 ,  ( 690 , 690 , 1)
 ,  ( 691 , 691 , 1)
 ,  ( 692 , 692 , 1)
 ,  ( 693 , 693 , 1)
 ,  ( 694 , 694 , 1)
 ,  ( 695 , 695 , 1)
 ,  ( 696 , 696 , 1)
 ,  ( 697 , 697 , 1)
 ,  ( 698 , 698 , 1)
 ,  ( 699 , 699 , 1)
 ,  ( 700 , 700 , 1)
 ,  ( 701 , 701 , 1)
 ,  ( 702 , 702 , 1)
 ,  ( 703 , 703 , 1)
 ,  ( 704 , 704 , 1)
 ,  ( 705 , 705 , 1)
 ,  ( 706 , 706 , 1)
 ,  ( 707 , 707 , 1)
 ,  ( 708 , 708 , 1)
 ,  ( 709 , 709 , 1)
 ,  ( 710 , 710 , 1)
 ,  ( 711 , 711 , 1)
 ,  ( 712 , 712 , 1)
 ,  ( 713 , 713 , 1)
 ,  ( 714 , 714 , 1)
 ,  ( 715 , 715 , 1)
 ,  ( 716 , 716 , 1)
 ,  ( 717 , 717 , 1)
 ,  ( 718 , 718 , 1)
 ,  ( 719 , 719 , 1)
 ,  ( 720 , 720 , 1)
 ,  ( 721 , 721 , 1)
 ,  ( 722 , 722 , 1)
 ,  ( 723 , 723 , 1)
 ,  ( 724 , 724 , 1)
 ,  ( 725 , 725 , 1)
 ,  ( 726 , 726 , 1)
 ,  ( 727 , 727 , 1)
 ,  ( 728 , 728 , 1)
 ,  ( 729 , 729 , 1)
 ,  ( 730 , 730 , 1)
 ,  ( 731 , 731 , 1)
 ,  ( 732 , 732 , 1)
 ,  ( 733 , 733 , 1)
 ,  ( 734 , 734 , 1)
 ,  ( 735 , 735 , 1)
 ,  ( 736 , 736 , 1)
 ,  ( 737 , 737 , 1)
 ,  ( 738 , 738 , 1)
 ,  ( 739 , 739 , 1)
 ,  ( 740 , 740 , 1)
 ,  ( 741 , 741 , 1)
 ,  ( 742 , 742 , 1)
 ,  ( 743 , 743 , 1)
 ,  ( 744 , 744 , 1)
 ,  ( 745 , 745 , 1)
 ,  ( 746 , 746 , 1)
 ,  ( 747 , 747 , 1)
 ,  ( 748 , 748 , 1)
 ,  ( 749 , 749 , 1)
 ,  ( 750 , 750 , 1)
 ,  ( 751 , 751 , 1)
 ,  ( 752 , 752 , 1)
 ,  ( 753 , 753 , 1)
 ,  ( 754 , 754 , 1)
 ,  ( 755 , 755 , 1)
 ,  ( 756 , 756 , 1)
 ,  ( 757 , 757 , 1)
 ,  ( 758 , 758 , 1)
 ,  ( 759 , 759 , 1)
 ,  ( 760 , 760 , 1)
 ,  ( 761 , 761 , 1)
 ,  ( 762 , 762 , 1)
 ,  ( 763 , 763 , 1)
 ,  ( 764 , 764 , 1)
 ,  ( 765 , 765 , 1)
 ,  ( 766 , 766 , 1)
 ,  ( 767 , 767 , 1)
 ,  ( 768 , 768 , 1)
 ,  ( 769 , 769 , 1)
 ,  ( 770 , 770 , 1)
 ,  ( 771 , 771 , 1)
 ,  ( 772 , 772 , 1)
 ,  ( 773 , 773 , 1)
 ,  ( 774 , 774 , 1)
 ,  ( 775 , 775 , 1)
 ,  ( 776 , 776 , 1)
 ,  ( 777 , 777 , 1)
 ,  ( 778 , 778 , 1)
 ,  ( 779 , 779 , 1)
 ,  ( 780 , 780 , 1)
 ,  ( 781 , 781 , 1)
 ,  ( 782 , 782 , 1)
 ,  ( 783 , 783 , 1)
 ,  ( 784 , 784 , 1)
 ,  ( 785 , 785 , 1)
 ,  ( 786 , 786 , 1)
 ,  ( 787 , 787 , 1)
 ,  ( 788 , 788 , 1)
 ,  ( 789 , 789 , 1)
 ,  ( 790 , 790 , 1)
 ,  ( 791 , 791 , 1)
 ,  ( 792 , 792 , 1)
 ,  ( 793 , 793 , 1)
 ,  ( 794 , 794 , 1)
 ,  ( 795 , 795 , 1)
 ,  ( 796 , 796 , 1)
 ,  ( 797 , 797 , 1)
 ,  ( 798 , 798 , 1)
 ,  ( 799 , 799 , 1)
 ,  ( 800 , 800 , 1)
 ,  ( 801 , 801 , 1)
 ,  ( 802 , 802 , 1)
 ,  ( 803 , 803 , 1)
 ,  ( 804 , 804 , 1)
 ,  ( 805 , 805 , 1)
 ,  ( 806 , 806 , 1)
 ,  ( 807 , 807 , 1)
 ,  ( 808 , 808 , 1)
 ,  ( 809 , 809 , 1)
 ,  ( 810 , 810 , 1)
 ,  ( 811 , 811 , 1)
 ,  ( 812 , 812 , 1)
 ,  ( 813 , 813 , 1)
 ,  ( 814 , 814 , 1)
 ,  ( 815 , 815 , 1)
 ,  ( 816 , 816 , 1)
 ,  ( 817 , 817 , 1)
 ,  ( 818 , 818 , 1)
 ,  ( 819 , 819 , 1)
 ,  ( 820 , 820 , 1)
 ,  ( 821 , 821 , 1)
 ,  ( 822 , 822 , 1)
 ,  ( 823 , 823 , 1)
 ,  ( 824 , 824 , 1)
 ,  ( 825 , 825 , 1)
 ,  ( 826 , 826 , 1)
 ,  ( 827 , 827 , 1)
 ,  ( 828 , 828 , 1)
 ,  ( 829 , 829 , 1)
 ,  ( 830 , 830 , 1)
 ,  ( 831 , 831 , 1)
 ,  ( 832 , 832 , 1)
 ,  ( 833 , 833 , 1)
 ,  ( 834 , 834 , 1)
 ,  ( 835 , 835 , 1)
 ,  ( 836 , 836 , 1)
 ,  ( 837 , 837 , 1)
 ,  ( 838 , 838 , 1)
 ,  ( 839 , 839 , 1)
 ,  ( 840 , 840 , 1)
 ,  ( 841 , 841 , 1)
 ,  ( 842 , 842 , 1)
 ,  ( 843 , 843 , 1)
 ,  ( 844 , 844 , 1)
 ,  ( 845 , 845 , 1)
 ,  ( 846 , 846 , 1)
 ,  ( 847 , 847 , 1)
 ,  ( 848 , 848 , 1)
 ,  ( 849 , 849 , 1)
 ,  ( 850 , 850 , 1)
 ,  ( 851 , 851 , 1)
 ,  ( 852 , 852 , 1)
 ,  ( 853 , 853 , 1)
 ,  ( 854 , 854 , 1)
 ,  ( 855 , 855 , 1)
 ,  ( 856 , 856 , 1)
 ,  ( 857 , 857 , 1)
 ,  ( 858 , 858 , 1)
 ,  ( 859 , 859 , 1)
 ,  ( 860 , 860 , 1)
 ,  ( 861 , 861 , 1)
 ,  ( 862 , 862 , 1)
 ,  ( 863 , 863 , 1)
 ,  ( 864 , 864 , 1)
 ,  ( 865 , 865 , 1)
 ,  ( 866 , 866 , 1)
 ,  ( 867 , 867 , 1)
 ,  ( 868 , 868 , 1)
 ,  ( 869 , 869 , 1)
 ,  ( 870 , 870 , 1)
 ,  ( 871 , 871 , 1)
 ,  ( 872 , 872 , 1)
 ,  ( 873 , 873 , 1)
 ,  ( 874 , 874 , 1)
 ,  ( 875 , 875 , 1)
 ,  ( 876 , 876 , 1)
 ,  ( 877 , 877 , 1)
 ,  ( 878 , 878 , 1)
 ,  ( 879 , 879 , 1)
 ,  ( 880 , 880 , 1)
 ,  ( 881 , 881 , 1)
 ,  ( 882 , 882 , 1)
 ,  ( 883 , 883 , 1)
 ,  ( 884 , 884 , 1)
 ,  ( 885 , 885 , 1)
 ,  ( 886 , 886 , 1)
 ,  ( 887 , 887 , 1)
 ,  ( 888 , 888 , 1)
 ,  ( 889 , 889 , 1)
 ,  ( 890 , 890 , 1)
 ,  ( 891 , 891 , 1)
 ,  ( 892 , 892 , 1)
 ,  ( 893 , 893 , 1)
 ,  ( 894 , 894 , 1)
 ,  ( 895 , 895 , 1)
 ,  ( 896 , 896 , 1)
 ,  ( 897 , 897 , 1)
 ,  ( 898 , 898 , 1)
 ,  ( 899 , 899 , 1)
 ,  ( 900 , 900 , 1)
 ,  ( 901 , 901 , 1)
 ,  ( 902 , 902 , 1)
 ,  ( 903 , 903 , 1)
 ,  ( 904 , 904 , 1)
 ,  ( 905 , 905 , 1)
 ,  ( 906 , 906 , 1)
 ,  ( 907 , 907 , 1)
 ,  ( 908 , 908 , 1)
 ,  ( 909 , 909 , 1)
 ,  ( 910 , 910 , 1)
 ,  ( 911 , 911 , 1)
 ,  ( 912 , 912 , 1)
 ,  ( 913 , 913 , 1)
 ,  ( 914 , 914 , 1)
 ,  ( 915 , 915 , 1)
 ,  ( 916 , 916 , 1)
 ,  ( 917 , 917 , 1)
 ,  ( 918 , 918 , 1)
 ,  ( 919 , 919 , 1)
 ,  ( 920 , 920 , 1)
 ,  ( 921 , 921 , 1)
 ,  ( 922 , 922 , 1)
 ,  ( 923 , 923 , 1)
 ,  ( 924 , 924 , 1)
 ,  ( 925 , 925 , 1)
 ,  ( 926 , 926 , 1)
 ,  ( 927 , 927 , 1)
 ,  ( 928 , 928 , 1)
 ,  ( 929 , 929 , 1)
 ,  ( 930 , 930 , 1)
 ,  ( 931 , 931 , 1)
 ,  ( 932 , 932 , 1)
 ,  ( 933 , 933 , 1)
 ,  ( 934 , 934 , 1)
 ,  ( 935 , 935 , 1)
 ,  ( 936 , 936 , 1)
 ,  ( 937 , 937 , 1)
 ,  ( 938 , 938 , 1)
 ,  ( 939 , 939 , 1)
 ,  ( 940 , 940 , 1)
 ,  ( 941 , 941 , 1)
 ,  ( 942 , 942 , 1)
 ,  ( 943 , 943 , 1)
 ,  ( 944 , 944 , 1)
 ,  ( 945 , 945 , 1)
 ,  ( 946 , 946 , 1)
 ,  ( 947 , 947 , 1)
 ,  ( 948 , 948 , 1)
 ,  ( 949 , 949 , 1)
 ,  ( 950 , 950 , 1)
 ,  ( 951 , 951 , 1)
 ,  ( 952 , 952 , 1)
 ,  ( 953 , 953 , 1)
 ,  ( 954 , 954 , 1)
 ,  ( 955 , 955 , 1)
 ,  ( 956 , 956 , 1)
 ,  ( 957 , 957 , 1)
 ,  ( 958 , 958 , 1)
 ,  ( 959 , 959 , 1)
 ,  ( 960 , 960 , 1)
 ,  ( 961 , 961 , 1)
 ,  ( 962 , 962 , 1)
 ,  ( 963 , 963 , 1)
 ,  ( 964 , 964 , 1)
 ,  ( 965 , 965 , 1)
 ,  ( 966 , 966 , 1)
 ,  ( 967 , 967 , 1)
 ,  ( 968 , 968 , 1)
 ,  ( 969 , 969 , 1)
 ,  ( 970 , 970 , 1)
 ,  ( 971 , 971 , 1)
 ,  ( 972 , 972 , 1)
 ,  ( 973 , 973 , 1)
 ,  ( 974 , 974 , 1)
 ,  ( 975 , 975 , 1)
 ,  ( 976 , 976 , 1)
 ,  ( 977 , 977 , 1)
 ,  ( 978 , 978 , 1)
 ,  ( 979 , 979 , 1)
 ,  ( 980 , 980 , 1)
 ,  ( 981 , 981 , 1)
 ,  ( 982 , 982 , 1)
 ,  ( 983 , 983 , 1)
 ,  ( 984 , 984 , 1)
 ,  ( 985 , 985 , 1)
 ,  ( 986 , 986 , 1)
 ,  ( 987 , 987 , 1)
 ,  ( 988 , 988 , 1)
 ,  ( 989 , 989 , 1)
 ,  ( 990 , 990 , 1)
 ,  ( 991 , 991 , 1)
 ,  ( 992 , 992 , 1)
 ,  ( 993 , 993 , 1)
 ,  ( 994 , 994 , 1)
 ,  ( 995 , 995 , 1)
 ,  ( 996 , 996 , 1)
 ,  ( 997 , 997 , 1)
 ,  ( 998 , 998 , 1)
 ,  ( 999 , 999 , 1)
 ,  ( 1000 , 1000 , 1
	) ) AS Source ( [CustomerID], [AddressID], [IsPrimary] )
ON ( Target.[AddressID] = Source.[AddressID]
	 AND Target.[CustomerID] = Source.[CustomerID]
   )
WHEN MATCHED AND ( NULLIF(Source.[IsPrimary], Target.[IsPrimary]) IS NOT NULL
				   OR NULLIF(Target.[IsPrimary], Source.[IsPrimary]) IS NOT NULL
				 ) THEN
	UPDATE SET [IsPrimary] = Source.[IsPrimary]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [CustomerID] ,
			 [AddressID] ,
			 [IsPrimary]
		   )
	VALUES ( Source.[CustomerID] ,
			 Source.[AddressID] ,
			 Source.[IsPrimary]
		   );
