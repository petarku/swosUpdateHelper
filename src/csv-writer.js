const fs = require('fs');
const normalize = require('normalize-text');
const swosRange = require('./swos-range.json');
const swosRangeRB = require('./swos-rangeRBLB.json');
const swosRangeLB = swosRangeRB ;
const swosRangeRW = require('./swos-rangeRWLW.json');
const swosRangeLW = swosRangeRW ; 
const swosRangeA = require('./swos-rangeA.json');
const swosRangeD = require('./swos-rangeD.json');
const swosRangeM = require('./swos-rangeM.json');
const swosRangeGK = require('./swos-rangeGK.json');

var _ = require("underscore");

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
	Macedonia:	'MAC',
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
	'4-3-3 Defending' : '4-5-1' 


};

function randomizeSkills (desiredSUM , res , RANGE) {
	//swos skills  P,V,H,T,C,S,F  
	
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
		if (from < RANGE.from) from = RANGE.from;
		if (rem < to) to = rem;

		res[i] = rand(from, to);
	});

	return res; 

}


function calculateSkills (desiredSUM , position) {

		let P = 0; 
		let V = 0 ; 
		let H = 0  ; 
		let T = 0; 
		let C = 0; 
		let S = 0 ; 
		let F = 0 ; 

		//let res = [P,V,H,T,C,S,F];

		let res; 
		let minRange = 0 ; 
		let maxRange = 7 ; 

		if (desiredSUM <= 14) {
			minRange = 0 ; 
			maxRange = 3 ; 
		}

		if (desiredSUM < 25 && desiredSUM > 14) {
			minRange = 1 ; 
			maxRange = 5 ; 
		}

		if (desiredSUM < 34 && desiredSUM >= 25) {
			minRange = 2 ; 
			maxRange = 6 ; 
		}

	if (desiredSUM > 33) {
		minRange = 3 ; 
	} 
	

	const RANGE = { from: minRange, to: maxRange };
 
	let randomRes = [0,0,0,0,0,0,0] ; 
	randomRes = randomizeSkills(desiredSUM , randomRes , RANGE)
	randomRes.sort(function(a, b){return b-a});
	

	if (position === 'Attacking Midfield') {
		P = randomRes[0] ; 
		C = randomRes[1] ; 

		let secundaryCharArray = randomRes.slice(2,6); 
		 
		secundaryCharArray = _.shuffle(secundaryCharArray); 
 
		V = secundaryCharArray[0] ; 
		S = secundaryCharArray[1] ; 
		F = secundaryCharArray[2] ;  
		T = secundaryCharArray[3] ; 
		H = randomRes[6] ; 
	} else if (positionCodeMap[position] === 'M') {
		P = randomRes[0] ; 
		T = randomRes[1] ; 
		
		let secundaryCharArray = randomRes.slice(2,6); 
		
		secundaryCharArray = _.shuffle(secundaryCharArray); 

		V = secundaryCharArray[0] ; 
		S = secundaryCharArray[1] ; 
		C = secundaryCharArray[2] ; 
		H = secundaryCharArray[3] ; 
		F = randomRes[6] ; 
	} else if (positionCodeMap[position] === 'A') {
		F = randomRes[0] ; 
		H = randomRes[1] ; 
		
		let secundaryCharArray = randomRes.slice(2,4); 
		
		secundaryCharArray = _.shuffle(secundaryCharArray); 

		V = secundaryCharArray[0] ; 
		S = secundaryCharArray[1] ; 
		C = randomRes[4] ; 
		P = randomRes[5] ; 
		T = randomRes[6] ; 
	}else if (positionCodeMap[position] === 'D') {
		T = randomRes[0] ; 
		H = randomRes[1] ; 
		let secundaryCharArray = randomRes.slice(2,4); 
		
		secundaryCharArray = _.shuffle(secundaryCharArray); 

		P = secundaryCharArray[0] ; 
		S = secundaryCharArray[1] ; 
		
		C = randomRes[4] ; 
		V = randomRes[5] ; 
		F = randomRes[6] ; 
	} else if ( (positionCodeMap[position] === 'LB') || ((positionCodeMap[position] === 'RB')) ){
		T = randomRes[0] ; 
		S = randomRes[1] ; 
		let secundaryCharArray = randomRes.slice(2,5); 
		
		secundaryCharArray = _.shuffle(secundaryCharArray); 

		P = secundaryCharArray[0] ; 
		C = secundaryCharArray[1] ; 
		
		V = secundaryCharArray[2] ; 
		H = randomRes[5] ; 
		F = randomRes[6] ; 
	} else if ( (positionCodeMap[position] === 'LW') || ((positionCodeMap[position] === 'RW')) ){
		S = randomRes[0] ; 
		C = randomRes[1] ; 
		let secundaryCharArray = randomRes.slice(2,6); 
		
		secundaryCharArray = _.shuffle(secundaryCharArray); 
	
		F = secundaryCharArray[0] ; 
		V = secundaryCharArray[1] ; 
		
		T = secundaryCharArray[2] ; 
		P = secundaryCharArray[3] ; 
		H = randomRes[6] ; 
	}

	res = [P,V,H,T,C,S,F] ; 
		

	
		return res; 

}



function slugify(text) {
	return text.toString().toLowerCase().trim()
		.replace(/&/g, '-and-')         // Replace & with 'and'
		.replace(/[\s\W-]+/g, '-')
		.replace(/-{2,}/g, '-')         // Replace multiple - with single -
		.replace(/^-+/, '')             // Trim - from start of text
		.replace(/-+$/, '');            // Trim - from end of text
}

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

function getTheSwosValue(player) {
	const positionPrefix = positionCodeMap[player.position] ; 
	
	ageRelatedIncrement(player) ; 
	switch (positionPrefix) {
		case 'GK':
			return getValueFromFile(swosRangeGK, player.valueStripped)
		case 'RB': 
			return getValueFromFile(swosRangeRB , player.valueStripped)
		case 'D': 
		return getValueFromFile(swosRangeD, player.valueStripped)
		case 'LB': 
		return getValueFromFile(swosRangeLB , player.valueStripped)
		case 'M': 
		return getValueFromFile(swosRangeM, player.valueStripped)
		case 'RW': 
		return getValueFromFile(swosRangeRW, player.valueStripped)
		case 'LW': 
		return getValueFromFile(swosRangeLW, player.valueStripped)
		case 'A': 
		return getValueFromFile(swosRangeA, player.valueStripped)
		
		default:
			
		  
	}
	
}

function getValueFromFile (fileName , valueStripped) {
	
	
	var swosResult = {};

	
		for (let i = 0; i < fileName.length; i++) {
			if (valueStripped >= fileName[i].minValue && valueStripped < fileName[i].maxValue) {
				
				swosResult.swosValue = fileName[i].swosValue;
				swosResult.desiredSum = fileName[i].desiredSum ; 
				return swosResult;
			}
		}
	
	
	swosResult.swosValue = '25K';
	swosResult.desiredSum = 0 ; 
	return swosResult ; 
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

	const swosData = getTheSwosValue(player);

	 player.swosValue = swosData.swosValue ; 
	 player.desiredSum = swosData.desiredSum ; 

	let skills7 ; 
	if (player.position === 'Goalkeeper') {
		player.swosValue = capGoalkeeperPrice(player.desiredSum, player.swosValue);
		skills7 = '0,0,0,0,0,0,0' ; 
	} else { 
	 	skills7 = calculateSkills(player.desiredSum, player.position);
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

	playersData.players
		.slice(0, 16)   
		.forEach(player => {
			lines.push(playerLine(player, nationalTeamName , teamStats));
		});

	checkForOverpoveredTeams(teamStats , clubName); 

	fs.writeFileSync(location + fname, lines.join('\r\n'));
}

function checkForOverpoveredTeams(teamStats , clubName) {
// 	555 max points per team , 82 max speed , max 7 players with 5 stars 
	if (teamStats.teamSum > 555) {
		console.log(`Stats for ${clubName} : team sum is bigger then 555 , it is ${teamStats.teamSum}`) ; 
	}
	if (teamStats.teamSpeed > 82) {
		console.log(`Stats for ${clubName} : team speed is bigger then 82 , it is ${teamStats.teamSpeed}`) ; 
	} 
	if (teamStats.fiveStarPlayersNo > 7) {
		console.log(`Stats for ${clubName} : five star players No is bigger than 7 , it is ${teamStats.fiveStarPlayersNo}`) ; 
	}
}

function writeLeague(league, data, location ) {
	data.forEach(club => {
		writeTeam(league, club, null, location);
	});
}


module.exports = {
	writeLeague, writeTeam , calculateSkills
};
