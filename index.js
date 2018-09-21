#!/usr/bin/env node

const superliga = require('./src/leagues');
const club = require('./src/club');
const fs = require('fs');
const leagues = require('./src/leagues.json');
const nationalTeams = require('./src/nationalTeams.json');
const csvWriter = require('./src/csv-writer.js');

function getLeague (league) {
	superliga
		.getClubs(league.url)
		.then(clubs => {
			const playersPromises = clubs.map(club.getPlayers);
			 
			return Promise.all(playersPromises);
		})
		.then(res => {
			const str = JSON.stringify(res, null, 2);
			fs.writeFileSync(`data/league-${league.name}.json`, str);
			console.log(`File data/league-${league.name}.json created!`);

			csvWriter.writeLeague(league, res);
		});
}

function getBestTeamInLeague (league) {
	superliga
		.getClubs(league.url)
		.then(clubs => {
			//const playersPromises = clubs.map(club.getPlayers);
			 const playersPromises = [ club.getPlayers(clubs[0]) ];		// get 1 club for tests
			return Promise.all(playersPromises);
		})
		.then(res => {
			const str = JSON.stringify(res, null, 2);
			fs.writeFileSync(`data/league-${league.name}.json`, str);
			console.log(`File data/league-${league.name}.json created!`);

			csvWriter.writeLeague(league, res);
		});
}

function getNationalTeams (nationalTeam) {
	club.getNationalTeamPlayers(nationalTeam).then(res => {
		const str = JSON.stringify(res, null, 2);
		fs.writeFileSync(`data/nationalTeam-${nationalTeam.name}.json`, str);
		console.log(`File data/nationalTeam-${nationalTeam.name}.json created!`);
		csvWriter.writeTeam(null, res, nationalTeam) ; 
	});
}

function getLeaguebyLeagueName(leagueName) { 
	for (var i in leagues) {
		if (leagues[i].name.indexOf(leagueName) !== -1) {
			//console.log(leagues[i]);
		 	return leagues[i] ;  
		}
	  }
	
}



//getLeaguebyLeagueName('serbia') ; 

const cmdline = require('node-cmdline-parser');

switch (true) {
	case cmdline.keyexists('testNational'):
		getNationalTeams(nationalTeams[0]) ;
	   break;
	case cmdline.keyexists('testLeague'):
		getBestTeamInLeague(leagues[5]);
	   break;
	case cmdline.keyexists('leagueName'):
		const leagueName = cmdline.get('leagueName')
		getLeague(getLeaguebyLeagueName(leagueName))
	   break;
	case cmdline.keyexists('allNational'):
		var arrayLength = nationalTeams.length;

		for (var i = 0; i < arrayLength; i++) {
			getNationalTeams(nationalTeams[i]) ;
		}
		break; 
	case cmdline.keyexists('help'):
		console.log('you can use node . -testNational to get 1 national team') ; 
		console.log('you can use node . -testLeague to get 1  team from league') ; 
		console.log('you can use node . -leagueName serbia to get teams from league of serbia') ; 
		break; 
	default:
	   	console.log('no command found ') ; 
	   	console.log('you can use node . -testNational to get 1 national team') ; 
		console.log('you can use node . -testLeague to get 1  team from league') ; 
		console.log('you can use node . -leagueName serbia to get teams from league of serbia') ; 
  }
