const fs = require('fs');
const normalize = require('normalize-text');

const countryCodeMap = {
	Albania: 'ALB',
	Austria: 'AUT',
	Belgium: 'BEL',
	Bulgaria: 'BUL',
	Croatia: 'CRO',
	Cyprus: 'CYP',

	Denmark: 'DEN',
	England: 'ENG',
	Estonia: 'EST',
	'Faroe Isles': 'FAR',
	Finland: 'FIN',
	France: 'FRA',
	Germany: 'GER',
	Greek: 'GRE',
	Hungary:	'HUN',
	Israel:	'ISR',
	Italy:	'ITA',
	Latvia:	'LAT',
	Lithuania:	'LIT',
	Luxembourg:	'LUX',
	Norway:	'NOR',
	Poland:	'POL',
	Portugal:	'POR',
	Romania:	'ROM',
	Russia:	'RUS',
	Scotland:	'SCO',
	Slovenia:	'SLO',
	Sweden:	'SWE',
	Turkey:	'TUR',
	Serbia: 'YUG',
	Spain: 'ESP',
	Netherlands: 'HOL',
	Ukraine:	'UKR',
	Wales:	'WAL',
	Armenia:	'ARM',
	Bosnia:	'BOS',
	Georgia:	'GEO',
	

	Macedonia:	'MAC',
	Turkmenistan:	'TRK',
	Liechtenstein:	'LIE',
	Moldova:	'MOL',
	
	Guatemala:	'GUA',
	Honduras:	'HON',
	'Hong Kong':'HON', 	
		
	Bahamas:	'BHM',
	Mexico:	'MEX',
	Panama:	'PAN',
	Bahrain:	'BAH',
	Nicaragua:	'NIC',
	Bermuda:	'BER',
	Jamaica:	'JAM',
	'Trinidad and Tobago':	'TRI',
	Canada:	'CAN',
	Barbados:	'BAR',
	'St. Vincent':	'SVC',
	Argentina:	'ARG',
	Bolivia:	'BOL',
	Brazil:	'BRA',
	Chile:	'CHL',
	Colombia:	'COL',
	Ecuador:	'ECU',
	Paraguay:	'PAR',
	Surinam:	'SUR',
		
		
	Uruguay:	'URU',
	Venezuela:	'VNZ',
	/*Guyana	GUY
	Peru	PER
	Algeria	ALG
	South Africa	SAF
	Botswana	BOT
	Burkina Faso	BFS
	Burundi	BUR
	Lesotho	LES
	Zair	ZAI
	Zambia	ZAM
	Ghana	GHA
	Senegal	SEN
	Ivory Coast	CIV
	Tunisia	TUN
	Mali	MLI
	Madagascar	MDG
	Cameroon	CMR
	Chad	CHD
	Uganda	UGA
	Liberia	LIB
	Mozambique	MOZ
	Kenya	KEN
	Sudan	SUD
	Swaziland	SWA
	Angola	ANG
	Togo	TOG
	Zimbabwe	ZIM
	Egypt	EGY
	Tanzania	TAN
	Niger	NIG
	Nigeria	
		
	Ethiopia	ETH
	Gabon	GAB
	Sierra Leone	SIE
Benin	BEN
Congo	CON
Guinea	GUI
Sierra Leone	SRL
Morocco	MAR
Gambia	GAM
Malawi	MLW
Japan	JAP
Taiwan	TAI
India	IND
Indonesia	
	
Bangladesh	BAN
Brunei	BRU
Iraq	IRA
Jordan	JOR
Sri Lanka	SRI
Syria	SYR
South Korea	KOR
Iran	IRN
Vietnam	VIE
Malaysia	MLY
Saudi Arabia	SAU
Yemen	YEM
Kuwait	KUW
Laos	LAO
North Korea	NKR
Oman	OMA
Pakistan	PAK
Philippines	PHI
China	CHI
Singapore	SGP
Mauritius	MAU
Myanmar	MYA
Papua New Guinea	PAP
Tajikistan	TAD
Uzbekistan	UZB
Qatar	QAT
United Arab Emis	UAE
Australia	AUS
New Zealand	NZL
Fiji	FIJ
Solomon Islands	SOL

	
	
	*/




	Cameroon: 'CMR',
	Ireland: 'IRL',
	Azerbaijan: 'AZB',
	Belarus: 'BLS',
	'Czech Republic': 'TCH',
	Iceland: 'ISL',
	Malta: 'MLT',
	'San Marino': 'SMR',
	'Northern Ireland': 'NIR',
	Slovakia: 'SVK',
	Switzerland: 'SUI',
	Chile: 'CHL',
	Venezuela: 'VNZ',
	'Costa Rica': 'CRC',
	'El Salvador': 'ELS',
	'United States': 'USA',
	'Burkina Faso': 'BFS',
	'Cote d\'Ivoire': 'CIV',
	Mali: 'MLI',
	'South Africa': 'SAF',
	'New Zealand': 'NZL',
	'Montenegro': 'CUS',
	'Cape Verde': 'CUS',
	'Comoros': 'CUS',
	Morocco: 'MAR',
	'DR Congo': 'CON',
	'St. Lucia:': 'CUS',

};




const positionCodeMap = {
	'Goalkeeper': 'GK',
	'Right-Back': 'RB',
	'Centre-Back': 'D',
	'Left-Back': 'LB',
	'Right Winger': 'RW',
	'Left Winger': 'LW',
	'Central Midfield': 'M',
	'Left Midfield': 'M',
	'Right Midfield': 'M',
	'Defensive Midfield': 'M',
	'Attacking Midfield': 'M',
	'Centre-Forward': 'A',
	'Second Striker': 'A',
};

const formationCodeMap = {
	'4-2-3-1': '4-5-1',
	'3-5-2 flat': '3-5-2',
	'4-3-3 off.': '4-3-3',
	'4-3-3 Attacking': '4-3-3',
	'5-3-2': '5-3-2',
	'4-1-3-2': '4-4-2',
	'4-3-2-1': '4-5-1',
	'4-3-1-2': '4-4-2',
	'4-4-2 double 6': '4-4-2',
	'3-4-2-1': '3-4-3',
	'4-1-4-1': '5-4-1',
	'4-4-1-1': '4-4-2',
	'3-5-2': '3-5-2',
	'3-4-1-2': '3-4-3',
	'4-4-2': '4-4-2',
	'3-4-3': '3-4-3',
	'5-4-1': '5-4-1',
	'4-5-1 flat': '4-5-1'

};

function calculateSkills(desiredSUM) {
	const RANGE = { from: 0, to: 7 };
	const res = [4, 0, 0, 3, 0, 0, 0];


	const rand = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};


	const remainder = () => desiredSUM - res.reduce((p, c) => c += p, 0);

	res.forEach((n, i) => {
		if (res[i]) return;
		const rem = remainder();
		const idx = i + 1;
		const remainingNumbers = res.length - i;

		let to = RANGE.to;
		let from = rem - (remainingNumbers - 1) * RANGE.to;
		if (from < 0) from = RANGE.from;
		if (rem < to) to = rem;

		res[i] = rand(from, to);
	});

	console.log(res, 20 - remainder());

}

function slugify(text) {
	return text.toString().toLowerCase().trim()
		.replace(/&/g, '-and-')         // Replace & with 'and'
		.replace(/[\s\W-]+/g, '-')
		.replace(/-{2,}/g, '-')         // Replace multiple - with single -
		.replace(/^-+/, '')             // Trim - from start of text
		.replace(/-+$/, '');            // Trim - from end of text
}


function playerLine(player, nationalTeamName) {
	// player lines: country code, index number (1 - 16), name, position code, black, 0,0,0,0,0,0,0, swos value
	//const country = player.flags[0];
	let country;
	if (nationalTeamName) {
		country = countryCodeMap[nationalTeamName] || nationalTeamName.substr(0, 3).toUpperCase();
	} else {
		const countryFromFlags = player.flags[0];
		country = countryCodeMap[countryFromFlags] || countryFromFlags.substr(0, 3).toUpperCase();
	}
	if (player.position === 'Goalkeeper') {

		player.swosValue = capGoalkeeperPrice(player.swosValue);
	}
	const playerName = normalize.normalizeDiacritics(player.name);
	const skills7 = '0,0,0,0,0,0,0';

	return [
		country,
		player.index,
		playerName,
		positionCodeMap[player.position],
		'White',
		skills7,
		player.swosValue
	].join(',');
}

function capGoalkeeperPrice(swosValue) {

	if (['8M', '7M', '6M', '5M'].indexOf(swosValue) >= 0) {
		swosValue = '4.5M';
	}
	return swosValue;

}

function petarsWeirdSelection(players) {

	let goalkeepers = players.filter(p => p.position === 'Goalkeeper');
	let gkIndex = 1;
	goalkeepers.forEach(gk => {                             // number goalkeepers: 1, 12,
		gk.index = gkIndex;
		gkIndex += 11;
	});
	let firstgoalkeeper = goalkeepers.slice(0, 1);
	let secondGoalkeeper = goalkeepers.slice(1, 2);

	var positionPriority = [
		'Goalkeeper',
		'Right-Back',
		'Centre-Back',
		'Left-Back',
		'Right Winger',
		'Central Midfield',
		'Left Midfield',
		'Right Midfield',
		'Defensive Midfield',
		'Attacking Midfield',
		'Left Winger',
		'Second Striker',
		'Centre-Forward',
	]

	let firstTeam = players
		.filter(p => p.position !== 'Goalkeeper')           // filter out GK
		.slice(0, 10)                                       // pick first 10 for first team                              // add the 2 goalkeepers
		.sort((a, b) => b.timeInPlay - a.timeInPlay);    // sorted per timeINPlay 



	let reserveTeam = players
		.filter(p => p.position !== 'Goalkeeper')         // filter out GK
		.slice(10, 14);                                     // take 4 reserves                               // add the 2 goalkeepers



	firstTeam = firstTeam.sort(function (a, b) {
		return positionPriority.indexOf(a.position) - positionPriority.indexOf(b.position)
	});   // sort positions by predefine list 

	let idx = 2;
	firstTeam.forEach(player => {                             // give the numbers starting from 2
		if (player.index) return;							// don't number if GK is first
		player.index = idx;
		idx += 1;

	});

	reserveTeam = reserveTeam.sort(function (a, b) {
		return positionPriority.indexOf(a.position) - positionPriority.indexOf(b.position)
	});

	idx = 13;
	reserveTeam.forEach(player => {                             // number other players
		if (player.index) return;							// don't number if GK is first
		player.index = idx;
		idx += 1;

	});


	let teamCSV = firstgoalkeeper.concat(firstTeam.concat(secondGoalkeeper.concat(reserveTeam)));

	return teamCSV;

}

function writeTeam(leagueData, playersData, nationalTeamData) {
	let clubName;
	let nationalTeamName;
	if (nationalTeamData) {
		clubName = normalize.normalizeDiacritics(nationalTeamData.name);
		nationalTeamName = nationalTeamData.name;
	} else {
		clubName = normalize.normalizeDiacritics(playersData.name);
	}

	const clubCoach = normalize.normalizeDiacritics(playersData.coach);
	let clubFormation = formationCodeMap[playersData.formation];
	if (!clubFormation) {
		console.error(`Formation  ${playersData.formation} for club ${clubName} not found `);
		console.log("Defaulting to 4-4-2");
		clubFormation = "4-4-2";
	}

	let fname;
	if (nationalTeamData) {
		fname = 'nationalTeam' + '-' + slugify(clubName) + '.csv';
		console.log(`Writing CSV for: 'nationalTeam'/${clubName}`);
	} else {
		fname = leagueData.name + '-' + slugify(clubName) + '.csv';
		console.log(`Writing CSV for: ${leagueData.name}/${clubName}`);
	}



	const lines = [];

	// first line: club name, nation number, team number, formation, coach name
	lines.push([clubName, 'NATION NUMBER', 'TEAM NUMBER', clubFormation, clubCoach, '', '', '', '', '', '', '', ''].join(','));

	petarsWeirdSelection(playersData.players)
		.forEach(player => {
			lines.push(playerLine(player, nationalTeamName));
		});

	fs.writeFileSync('data-csv/' + fname, lines.join('\r\n'));
}

function writeLeague(league, data) {
	data.forEach(club => {
		writeTeam(league, club, null);
	});
}




module.exports = {
	writeLeague, writeTeam
};
