#!/usr/bin/env node

const superliga = require('./superliga');
const club = require('./club');
const fs = require('fs');

const FNAME = 'superliga.json';

const leagues = [
	{ name: 'serbian', url: '/superliga/startseite/wettbewerb/SER1' },
	{ name: 'spanish', url: '/primera-division/startseite/wettbewerb/ES1' }
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
			fs.writeFileSync(`${league.name}-league.json`, str);
			//console.log(`File ${FNAME} created!`);
		});
}

leagues.forEach(getLeague);
