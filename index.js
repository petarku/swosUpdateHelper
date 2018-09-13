#!/usr/bin/env node

const superliga = require('./src/leagues');
const club = require('./src/club');
const fs = require('fs');
const leagues = require('./src/leagues.json');
const nationalTeams = require('./src/nationalTeams.json');

function getLeague (league) {
	superliga.getClubs(league.url)
		.then(clubs => {
			const playersPromises = clubs.map(club.getPlayers);
			return Promise.all(playersPromises);
		})
		.then(res => {
			const str = JSON.stringify(res, null, 2);
			fs.writeFileSync(`data/league-${league.name}.json`, str);
			console.log(`File data/league-${league.name}.json created!`);
		});
}

function getNationalTeams(nationalTeam) {
		club.getNationalTeamPlayers(nationalTeam).then(res => {
			const str = JSON.stringify(res, null, 2);
			fs.writeFileSync(`data/nationalTeam-${nationalTeam.name}.json`, str);
			console.log(`File data/nationalTeam-${nationalTeam.name}.json created!`);
		})
		
		

	

}

// leagues.forEach(getLeague);	// get all leaggues
getLeague(leagues[0]);			// get 1 league - for tests
//getNationalTeams(nationalTeams[0]) ; 