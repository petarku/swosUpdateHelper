const fs = require('fs');
const normalize = require('normalize-text');

const dataProcessing = require('./data-processing.js');


const countryCodeMap = {
	

	Albania:	'ALB',
	Austria:	'AUT',
	Belgium:	'BEL',
	Bulgaria:	'BUL',
	Croatia:	'CRO',
	Cyprus:	'CYP',
	'Czech Republic':	'TCH',
	Denmark:	'DEN',
	England:	'ENG',
	Estonia:	'EST',
	'Faroe Isles':	'FAR',
	Finland:	'FIN',
	France:	'FRA',
	Germany:	'GER',
	Greece:	'GRE',
	Hungary:	'HUN',
	Iceland:	'ISL',
	Israel:	'ISR',
	Italy:	'ITA',
	Ireland: 'IRL',
	Latvia:	'LAT',
	Lithuania:	'LIT',
	Luxembourg:	'LUX',
	Malta:	'MLT',
	Netherlands:	'HOL',
	'Northern Ireland':	'NIR',
	Norway:	'NOR',
	Poland:	'POL',
	Portugal:	'POR',
	Romania:	'ROM',
	Russia:	'RUS',
	'San Marino':	'SMR',
	Scotland:	'SCO',
	Slovenia:	'SLO',
	Sweden:	'SWE',
	Turkey:	'TUR',
	Ukraine:	'UKR',
	Wales:	'WAL',
	Serbia:	'YUG',
	Belarus:	'BLS',
	Slovakia:	'SVK',
	Spain:	'ESP',
	Armenia:	'ARM',
	'Bosnia-Herzegovina':	'BOS',
	Azerbaijan:	'AZB',
	Georgia:	'GEO',
	Switzerland:	'SUI',
	'North Macedonia':	'MAC',
	Turkmenistan:	'TRK',
	Liechtenstein:	'LIE',
	Moldova:	'MOL',
	'Costa Rica':	'CRC',
	'El Salvador':	'SAL',
	Guatemala:	'GUA',
	Honduras:	'HON',
	'Hong Kong':	'HON',
	Bahamas:	'BHM',
	Mexico:	'MEX',
	Panama:	'PAN',
	'United States':	'USA',
	Bahrain:	'BAH',
	Nicaragua:	'NIC',
	Bermuda:	'BER',
	Jamaica:	'JAM',
	'Trinidad and Tobago':	'TRI',
	Canada:	'CAN',
	Barbados:	'BAR',
	'El Salvador':	'ELS',
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
	Guyana:	'GUY',
	Peru:	'PER',
	Algeria:	'ALG',
	'South Africa':	'SAF',
	Botswana:	'BOT',
	'Burkina Faso':	'BFS',
	Burundi:	'BUR',
	Lesotho:	'LES',
	Zair:	'ZAI',
	Zambia:	'ZAM',
	Ghana:	'GHA',
	Senegal:	'SEN',
	'Cote d\'Ivoire': 'CIV',
	Tunisia:	'TUN',
	Mali:	'MLI',
	Madagascar:	'MDG',
	Cameroon:	'CMR',
	Chad:	'CHD',
	Uganda:	'UGA',
	Liberia:	'LIB',
	Mozambique:	'MOZ',
	Kenya:	'KEN',
	Sudan:	'SUD',
	Swaziland:	'SWA',
	Angola:	'ANG',
	Togo:	'TOG',
	Zimbabwe:	'ZIM',
	Egypt:	'EGY',
	Tanzania:	'TAN',
	Niger:	'NIG',
	Nigeria:	'NIG',
	Ethiopia:	'ETH',
	Gabon:	'GAB',
	'Sierra Leone':	'SIE',
	Benin:	'BEN',
	Congo:	'CON',
	'DR Congo': 'CON',
	Guinea:	'GUI',
	Morocco:	'MAR',
	Gambia:	'GAM',
	Malawi:	'MLW',
	Japan:	'JAP',
	Taiwan:	'TAI',
	India:	'IND',
	Indonesia:	'IND',
	Bangladesh:	'BAN',
	Brunei:	'BRU',
	Iraq:	'IRA',
	Jordan:	'JOR',
	'Sri Lanka':	'SRI',
	Syria:	'SYR',
	'South Korea':	'KOR',
	Iran:	'IRN',
	Vietnam:	'VIE',
	Malaysia:	'MLY',
	'Saudi Arabia':	'SAU',
	Yemen:	'YEM',
	Kuwait:	'KUW',
	Laos:	'LAO',
	'North Korea':	'NKR',
	Oman:	'OMA',
	Pakistan:	'PAK',
	Philippines:	'PHI',
	China:	'CHI',
	Singapore:	'SGP',
	Mauritius:	'MAU',
	Myanmar:	'MYA',
	'Papua New Guinea':	'PAP',
	Tajikistan:	'TAD',
	Uzbekistan:	'UZB',
	Qatar:	'QAT',
	'United Arab Emis':	'UAE',
	Australia:	'AUS',
	'New Zealand':	'NZL',
	Fiji:	'FIJ',
	'Solomon Islands':	'SOL',


	

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
	'5-4-1 Diamond': '5-4-1',
	'4-5-1 flat': '4-5-1', 
	'3-5-2 Attacking':'3-5-2', 
	'4-4-2 Diamond': '4-4-2' , 
	'3-4-3 Diamond': '3-4-3' ,
	'4-3-3 Defending' : '4-5-1' 


};


function ageRelatedIncrement(player) {
	const age =  parseInt(player.age) ; 

	
	if ((age) < 31 ){ 
		player.valueStripped = player.valueStripped * 1 ; 
	} else if ((age) < 32) {
		player.valueStripped = player.valueStripped * 1.25 ; 
	} else if ((age) < 35) {
		player.valueStripped = player.valueStripped * 1.5 ; 
	} else if ((age) < 38) {
		player.valueStripped = player.valueStripped * 2 ; 
	} else if ((age) < 40) {
		player.valueStripped = player.valueStripped * 2.5 ; 
	} else {
		player.valueStripped = player.valueStripped * 3 ; 
	}
	
}


function slugify(text) {
	return text.toString().toLowerCase().trim()
		.replace(/&/g, '-and-')         // Replace & with 'and'
		.replace(/[\s\W-]+/g, '-')
		.replace(/-{2,}/g, '-')         // Replace multiple - with single -
		.replace(/^-+/, '')             // Trim - from start of text
		.replace(/-+$/, '');            // Trim - from end of text
}








function playerLine(player, nationalTeamName , teamStats) {
	// player lines: country code, index number (1 - 16), name, position code, black, 0,0,0,0,0,0,0, swos value
	//const country = player.flags[0];
	let country;
	if (nationalTeamName) {
		country = countryCodeMap[nationalTeamName] || 'CUS';
	} else {
		const countryFromFlags = player.flags[0];
		country = countryCodeMap[countryFromFlags] || 'CUS';
	}


	const playerName = normalize.normalizeDiacritics(player.name);

	

	const swosData = dataProcessing.getTheSwosValue(player);

	 player.swosValue = swosData.swosValue ; 
	 player.desiredSum = swosData.desiredSum ; 

	let skills7 ; 

	
	if (player.position === 'Goalkeeper') {
		//player.swosValue = capGoalkeeperPrice(player.desiredSum, player.swosValue);
		skills7 = '0,0,0,0,0,0,0' ; 
	} else { 
	 	skills7 = dataProcessing.calculateSkills(player.desiredSum, player.position);
	} 

	teamStats.teamSum = teamStats.teamSum + player.desiredSum ;

	if (player.position !== 'Goalkeeper') {
		teamStats.teamSpeed = teamStats.teamSpeed + parseInt(skills7[5]) ; 
	}
	if (player.desiredSum > 39) {
		teamStats.fiveStarPlayersNo = teamStats.fiveStarPlayersNo + 1 ; 
	}

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

function capGoalkeeperPrice(charSum, swosValue) {

	if (charSum > 40) {
		swosValue = '4.5M';
	}
	return swosValue;

}



function writeTeam(leagueData, playersData, nationalTeamData , location) {
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


	let teamStats = new Object(); 
	teamStats.teamSum = 0 ;
	teamStats.teamSpeed = 0 ; 
	teamStats.fiveStarPlayersNo = 0 ; 

	for (const player of playersData.players) {
		ageRelatedIncrement(player); 
	}
	
	
	playersData.players.sort((a, b) => b.valueStripped - a.valueStripped);
	playersData.players = dataProcessing.sortPlayersSwosStyle3(playersData.players, playersData.formation);

	playersData.players
		.slice(0, 16)   
		.forEach(player => {
			lines.push(playerLine(player, nationalTeamName , teamStats));
		});

	
	dataProcessing.checkForOverpoveredTeams(teamStats , clubName); 

	fs.writeFileSync(location + fname, lines.join('\r\n'));

	const linesFull = [];
	linesFull.push([clubName, 'NATION NUMBER', 'TEAM NUMBER', clubFormation, clubCoach, '', '', '', '', '', '', '', ''].join(','));
	playersData.players
		 
		.forEach(player => {
			linesFull.push(playerLine(player, nationalTeamName , teamStats));
		});
	let fnameFull = leagueData.name + '-' + slugify(clubName) + '-' + 'FULL' + '.csv';
	fs.writeFileSync(location + fnameFull, linesFull.join('\r\n'));


}



function writeLeague(league, data, location ) {
	data.forEach(club => {
		writeTeam(league, club, null, location);
	});
}


module.exports = {
	writeLeague, writeTeam 
};
