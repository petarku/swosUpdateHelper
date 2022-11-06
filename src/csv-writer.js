const fs = require('fs');
const normalize = require('normalize-text');

const dataProcessing = require('./data-processing.js');
const constants = require('./constants');



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
		country = constants.countryCodeMap[nationalTeamName] || 'CUS';
	} else {
		
			const countryFromFlags = player.flags[0];
		
		country = constants.countryCodeMap[countryFromFlags] || 'CUS';
		
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
		constants.positionCodeMap[player.position],
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
		clubName =clubName.replace ('FK', ''); 
		//clubName = clubName.replace('Belgrade', 'B\'GRADE'); 
		//clubName = clubName.replace('Novi Sad', 'N. SAD') ; 
	}

	const clubCoach = normalize.normalizeDiacritics(playersData.coach);
	
	let clubFormation = constants.formationCodeMap[playersData.formation];
	if (!clubFormation) {
		console.error(`Formation  ${playersData.formation} for club ${clubName} not found `);
		console.log("Defaulting to 4-5-1");
		playersData.formation = "4-5-1";
		cclubFormation = constants.formationCodeMap[playersData.formation];
		
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

	let fullData = [...playersData.players]; 
	
	if (sortByCost) { 
		playersData.players.sort((a, b) => b.valueStripped - a.valueStripped);
	} else {
		playersData.players.sort((a, b) => b.timeInPlay - a.timeInPlay); 
	} 
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
	fullData.forEach(player => {
			linesFull.push(playerLine(player, nationalTeamName , teamStats));
		});

		let fnameFull ;
		if (nationalTeamData) {
			fnameFull = 'nationalTeam' + '-' + slugify(clubName) + '-' + 'FULL' + '.csv';
			console.log(`Writing Full CSV for: 'nationalTeam'/${clubName}`);
		} else {
			fnameFull = leagueData.name + '-' + slugify(clubName) + '-' + 'FULL' + '.csv';
			console.log(`Writing Full CSV for: ${leagueData.name}/${clubName}`);
		}
	
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
