#!/usr/bin/env node

const superliga = require('./superliga');
const club = require('./club');
const fs = require('fs');

const FNAME = 'superliga.json';

const leagues = [
	{ name: 'serbia', url: '/superliga/startseite/wettbewerb/SER1' },
	{ name: 'italy', url: '/serie-a/startseite/wettbewerb/IT1' }
//	{ name: 'england', url: '/premier-league/startseite/wettbewerb/GB1' },
//	{ name: 'germany', url: '/1-bundesliga/startseite/wettbewerb/L1' }
//	{ name: 'spain', url: '/primera-division/startseite/wettbewerb/ES1' }
];



function getLeague (league) {
	superliga
		.getClubs(league.url)
		.then(res => {
			const playersPromises = res.map(club.getPlayers);
			return Promise.all(playersPromises);
		})
		.then(res => {
			const str = JSON.stringify(res, null, 2);
			fs.writeFileSync(`league-${league.name}.json`, str);
			console.log(`File league-${league.name}.json created!`);
		});
}

leagues.forEach(getLeague);
