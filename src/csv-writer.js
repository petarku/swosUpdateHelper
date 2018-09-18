const fs = require('fs');
const normalize = require('normalize-text');

const countryCodeMap = {
	Romania: 'ROM',
	Serbia: 'SER',
	Poland: 'POL',
	Germany: 'GER',
};

const positionCodeMap = {
	'Goalkeeper':'GK',
	'Right-Back':'RB',
	'Centre-Back':'D',
	'Left-Back':'LB',
	'Right Winger':'RW',
	'Left Winger':'LW',
	'Central Midfield':'M',
	'Defensive Midfield':'M',
	'Attacking Midfield':'M',
	'Centre-Forward':'A',
	'Second Striker':'A',
};

function slugify (text) {
	return text.toString().toLowerCase().trim()
		.replace(/&/g, '-and-')         // Replace & with 'and'
		.replace(/[\s\W-]+/g, '-')
		.replace(/-{2,}/g, '-')         // Replace multiple - with single -
		.replace(/^-+/, '')             // Trim - from start of text
		.replace(/-+$/, '');            // Trim - from end of text
}


function playerLine (player) {
	// player lines: country code, index number (1 - 16), name, position code, black, 0,0,0,0,0,0,0, swos value
	const country = player.flags[0];
	const playerName = normalize.normalizeDiacritics(player.name) ; 

	return [
		countryCodeMap[country] || country.substr(0, 3).toUpperCase(),
		player.index,
		playerName,
		positionCodeMap[player.position],
		'BLACK',
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		player.swosValue
	].join(',');
}


function petarsWeirdSelection (players) {
	let goalkeepers = players.filter(p => p.position === 'Goalkeeper');
	let gkIndex = 1;
	goalkeepers.forEach(gk => {                             // number goalkeepers: 1, 12,
		gk.index = gkIndex;
		gkIndex += 11;
	});
	goalkeepers = goalkeepers.slice(0, 2);

	players = players
		.filter(p => p.position !== 'Goalkeeper')           // filter out GK
		.slice(0, 14)                                       // take 14 non-GK players
		.concat(goalkeepers)                                // add the 2 goalkeepers
		.sort((a, b) => b.timeInPlay - a.timeInPlay);       // sort all by time in play

	let idx = 2;
	players.forEach(player => {                             // number other players
		if (player.index) return;							// don't number if GK is first
		player.index = idx;
		idx += 1;
		if (idx === 12) idx += 1;
	});
	return players;
}


function writeClub (league, club) {
	const clubName = normalize.normalizeDiacritics(club.name); 
	const clubCoach = normalize.normalizeDiacritics(club.coach); 
	const fname = league.name + '-' + slugify(clubName) + '.csv';
	console.log(`Writing CSV for: ${league.name}/${clubName}`);

	const lines = [];

	// first line: club name, nation number, team number, formation, coach name
	lines.push([ clubName, 'NATION NUMBER', 'TEAM NUMBER', club.formation, clubCoach, '', '', '', '', '', '', '', '' ].join(','));

	petarsWeirdSelection(club.players)
		.forEach(player => {
			lines.push(playerLine(player));
		});

	fs.writeFileSync('data-csv/' + fname, lines.join('\n'));
}


function writeLeague (league, data) {
	data.forEach(club => {
		writeClub(league, club);
	});
}


module.exports = {
	writeLeague,
};