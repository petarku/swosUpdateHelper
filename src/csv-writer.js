const fs = require('fs');
const normalize = require('normalize-text');

const countryCodeMap = {
	Austria: 'AUT',
	Serbia: 'YUG',
	Spain:'ESP', 
	Netherlands:'HOL',
	Camerun:'CMR', 
	Ireland:'IRL' , 
	Azerbaijan:'AZB', 
	Belarus:'BLS', 
	'Czech Republic':'TCH', 
	Iceland:'ISL', 
	Malta:'MLT', 
	'San Marino':'SMR', 
	'Northern Ireland':'NIR', 
	Slovakia:'SVK', 
	Switzerland:'SUI',
	Chile:'CHL', 
	Venezuela:'VNZ',
	'Costa Rica':'CRC',
	'El Salvador':'ELS',
	'United States':'USA',
	'Burkina Faso':'BFS',
	'Cote d\'Ivoire':'CIV', 
	Mali:'MLI', 
	'South Africa': 'SAF',
	'New Zealand':'NZL', 
	'Montenegro':'CUS', 
	'Cape Verde':'CUS',
	'Comoros':'CUS', 
	 Morocco:'MAR', 

};

const positionCodeMap = {
	'Goalkeeper':'GK',
	'Right-Back':'RB',
	'Centre-Back':'D',
	'Left-Back':'LB',
	'Right Winger':'RW',
	'Left Winger':'LW',
	'Central Midfield':'M',
	'Left Midfield':'M', 
	'Right Midfield':'M',
	'Defensive Midfield':'M',
	'Attacking Midfield':'M',
	'Centre-Forward':'A',
	'Second Striker':'A',
};

const formationCodeMap = {
	'4-2-3-1':'4-5-1',
	'3-5-2 flat':'3-5-2', 
	'4-3-3 off.':'4-3-3', 
	'5-3-2':'5-3-2', 
	'4-1-3-2':'4-4-2', 
	'4-3-2-1':'4-5-1',
	'4-3-1-2':'4-4-2', 
	'4-4-2 double 6':'4-4-2', 
	'3-4-2-1': '3-4-3', 
	'4-1-4-1':'5-4-1',
	'3-5-2':'3-5-2', 

};


function slugify (text) {
	return text.toString().toLowerCase().trim()
		.replace(/&/g, '-and-')         // Replace & with 'and'
		.replace(/[\s\W-]+/g, '-')
		.replace(/-{2,}/g, '-')         // Replace multiple - with single -
		.replace(/^-+/, '')             // Trim - from start of text
		.replace(/-+$/, '');            // Trim - from end of text
}


function playerLine (player , nationalTeamName) {
	// player lines: country code, index number (1 - 16), name, position code, black, 0,0,0,0,0,0,0, swos value
	//const country = player.flags[0];
	let country ;
	if (nationalTeamName) {
		country = countryCodeMap[nationalTeamName] || nationalTeamName.substr(0, 3).toUpperCase() ; 
	} else {
		const countryFromFlags = player.flags[0];
		country = countryCodeMap[countryFromFlags] || countryFromFlags.substr(0, 3).toUpperCase() ;
	}
	player.swosValue = capGoalkeeperPrice(player.swosValue); 
	const playerName = normalize.normalizeDiacritics(player.name) ; 
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
		swosValue= '4.5M ; '
	}
	return swosValue ; 
	
}

function petarsWeirdSelection (players) {
	
	let goalkeepers = players.filter(p => p.position === 'Goalkeeper');
	let gkIndex = 1;
	goalkeepers.forEach(gk => {                             // number goalkeepers: 1, 12,
		gk.index = gkIndex;
		gkIndex += 11;
	});
	let firstgoalkeeper = goalkeepers.slice(0, 1);
	let secondGoalkeeper = goalkeepers.slice(1,2) ; 

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
		


	firstTeam = firstTeam.sort( function(a,b){ 
		return positionPriority.indexOf( a.position ) - positionPriority.indexOf( b.position ) 
	});   // sort positions by predefine list 

	let idx = 2;
	firstTeam.forEach(player => {                             // give the numbers starting from 2
		if (player.index) return;							// don't number if GK is first
		player.index = idx;
		idx += 1;
		
	});
	
	reserveTeam = reserveTeam.sort( function(a,b){ 
		return positionPriority.indexOf( a.position ) - positionPriority.indexOf( b.position ) 
	});

	idx = 13;
	reserveTeam.forEach(player => {                             // number other players
		if (player.index) return;							// don't number if GK is first
		player.index = idx;
		idx += 1;
		
	});


  	let teamCSV = firstgoalkeeper.concat(firstTeam.concat(secondGoalkeeper.concat(reserveTeam))); 

 return teamCSV ; 

}

function writeTeam (leagueData, playersData , nationalTeamData) {
	let clubName ; 
	let nationalTeamName ; 
	if (nationalTeamData) {
		clubName = normalize.normalizeDiacritics(nationalTeamData.name); 
		nationalTeamName = nationalTeamData.name ; 
	} else {
		clubName = normalize.normalizeDiacritics(playersData.name); 
	}
	
	const clubCoach = normalize.normalizeDiacritics(playersData.coach); 
	const clubFormation = formationCodeMap[playersData.formation] || '4-4-2'; 
	
	let fname ; 
	if (nationalTeamData) {
		fname = 'nationalTeam' + '-' + slugify(clubName) + '.csv';
		console.log(`Writing CSV for: 'nationalTeam'/${clubName}`);
	} else {
		fname = leagueData.name + '-' + slugify(clubName) + '.csv';
		console.log(`Writing CSV for: ${leagueData.name}/${clubName}`);
	}
	
	

	const lines = [];

	// first line: club name, nation number, team number, formation, coach name
	lines.push([ clubName, 'NATION NUMBER', 'TEAM NUMBER', clubFormation, clubCoach, '', '', '', '', '', '', '', '' ].join(','));

	petarsWeirdSelection(playersData.players)
		.forEach(player => {
			lines.push(playerLine(player , nationalTeamName));
		});

	fs.writeFileSync('data-csv/' + fname, lines.join('\r\n'));
}

function writeLeague (league, data) {
	data.forEach(club => {
		writeTeam(league, club, null);
	});
}




module.exports = {
	writeLeague,writeTeam
};
